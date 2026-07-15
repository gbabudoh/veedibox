import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { stripe } from '@/lib/stripe/client';
import { requireSession } from '@/lib/auth/requireAdmin';
import { LICENSE_MULT, LICENSE_TO_DB, UiLicense } from '@/lib/product-mapper';

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        license: z.enum(['personal', 'commercial', 'extended'])
      })
    )
    .min(1)
});

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { items } = parsed.data;
  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, status: 'published' } });
  const productById = new Map(products.map((p) => [p.id, p]));

  const missing = productIds.filter((id) => !productById.has(id));
  if (missing.length > 0) {
    return NextResponse.json({ error: `Some items in your cart are no longer available: ${missing.join(', ')}` }, { status: 400 });
  }

  const lineItems = items.map((i) => {
    const product = productById.get(i.productId)!;
    const priceCents = Math.round(product.price * LICENSE_MULT[i.license as UiLicense]);
    return { product, license: i.license as UiLicense, priceCents };
  });

  const totalCents = lineItems.reduce((sum, l) => sum + l.priceCents, 0);

  const order = await prisma.order.create({
    data: {
      userId: (session.user as any).id,
      status: 'PENDING',
      totalCents,
      items: {
        create: lineItems.map((l) => ({
          productId: l.product.id,
          license: LICENSE_TO_DB[l.license],
          priceCents: l.priceCents
        }))
      }
    }
  });

  const baseUrl = process.env.NEXTAUTH_URL || req.nextUrl.origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: session.user?.email ?? undefined,
    line_items: lineItems.map((l) => ({
      price_data: {
        currency: 'usd',
        unit_amount: l.priceCents,
        product_data: { name: l.product.title }
      },
      quantity: 1
    })),
    success_url: `${baseUrl}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout`,
    metadata: { orderId: order.id }
  });

  await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: checkoutSession.id } });

  return NextResponse.json({ url: checkoutSession.url });
}
