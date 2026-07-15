import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { prisma } from '@/lib/db/client';

const DOWNLOAD_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const order = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
      include: { items: { include: { product: { include: { files: true } } } } }
    });
    if (!order) return NextResponse.json({ received: true });

    // Stripe redelivers events at-least-once; skip if this order was already marked paid.
    if (order.status !== 'PAID') {
      const expiresAt = new Date(Date.now() + DOWNLOAD_TOKEN_EXPIRY_MS);
      const tokens = order.items.flatMap((item) =>
        item.product.files.map((file) => ({
          orderItemId: item.id,
          productFileId: file.id,
          token: crypto.randomUUID(),
          expiresAt
        }))
      );

      await prisma.$transaction([
        prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } }),
        prisma.downloadToken.createMany({ data: tokens })
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
