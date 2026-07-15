import Link from 'next/link';
import { prisma } from '@/lib/db/client';
import { stripe } from '@/lib/stripe/client';
import { formatUSD } from '@/lib/product-mapper';
import { ClearCartOnMount } from '@/components/cart/ClearCartOnMount';
import { colors, fonts, maxWidth, radii, shadows } from '@/lib/theme';

export default async function CheckoutConfirmationPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id;

  const [stripeSession, order] = sessionId
    ? await Promise.all([
        stripe.checkout.sessions.retrieve(sessionId).catch(() => null),
        prisma.order.findUnique({ where: { stripeSessionId: sessionId }, include: { items: { include: { product: true } } } })
      ])
    : [null, null];

  const paid = stripeSession?.payment_status === 'paid' || order?.status === 'PAID';

  if (!paid) {
    return (
      <div style={{ maxWidth: maxWidth.confirmation, margin: '0 auto', padding: '100px 32px', textAlign: 'center', animation: 'fadeIn 0.35s ease' }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, margin: '0 0 12px' }}>Processing your order…</h1>
        <p style={{ fontSize: 14.5, color: colors.textMuted, lineHeight: 1.6, margin: '0 0 28px' }}>
          We&apos;re confirming your payment. This usually takes a few seconds — refresh this page, or check My Veedibox shortly.
        </p>
        <Link
          href="/dashboard"
          style={{ border: `1px solid ${colors.borderStrong}`, background: colors.surface, fontWeight: 700, fontSize: 15, padding: '15px 26px', borderRadius: 12, cursor: 'pointer', display: 'inline-block' }}
        >
          Go to My Veedibox
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: maxWidth.confirmation, margin: '0 auto', padding: '100px 32px', textAlign: 'center', animation: 'fadeIn 0.35s ease' }}>
      <ClearCartOnMount />
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: colors.heroGradient,
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 28,
          fontWeight: 800
        }}
      >
        ✓
      </div>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, margin: '0 0 12px' }}>Order confirmed</h1>
      <p style={{ fontSize: 14.5, color: colors.textMuted, lineHeight: 1.6, margin: '0 0 28px' }}>
        Your files are ready. We&apos;ve also emailed you a receipt and download links.
      </p>
      {order && (
        <div style={{ background: colors.surfaceMuted, borderRadius: radii.xxl, padding: 20, textAlign: 'left', marginBottom: 28 }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
              <span>{item.product.title}</span>
              <span style={{ fontWeight: 700 }}>${formatUSD(item.priceCents)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 15, paddingTop: 14 }}>
            <span>Total</span>
            <span>${formatUSD(order.totalCents)}</span>
          </div>
        </div>
      )}
      <Link
        href="/dashboard/downloads"
        style={{
          border: 'none',
          background: colors.primaryGradient,
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          padding: '15px 26px',
          borderRadius: 12,
          cursor: 'pointer',
          display: 'inline-block',
          boxShadow: shadows.primaryGlow
        }}
      >
        Go to My Veedibox
      </Link>
    </div>
  );
}
