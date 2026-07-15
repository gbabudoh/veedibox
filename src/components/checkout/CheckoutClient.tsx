'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/lib/cart/CartContext';
import { colors, fonts, maxWidth, radii, shadows } from '@/lib/theme';
import { Input } from '@/components/ui/Input';

export function CheckoutClient() {
  const { items, details, total } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  const completeCheckout = async () => {
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map((i) => ({ productId: i.id, license: i.license })) })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Something went wrong starting checkout.');
      setSubmitting(false);
      return;
    }
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div
      style={{
        maxWidth: maxWidth.checkout,
        margin: '0 auto',
        padding: '48px 32px 96px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 44,
        animation: 'fadeIn 0.35s ease'
      }}
    >
      <div>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 24px' }}>Checkout</h1>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Email</div>
        <Input value={session?.user?.email ?? ''} readOnly style={{ marginBottom: 22 }} />
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Payment method</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
          <div
            style={{
              flex: 1,
              border: `2px solid ${colors.primary}`,
              borderRadius: radii.lg,
              padding: 16,
              fontWeight: 700,
              fontSize: 14,
              background: colors.primarySofter
            }}
          >
            Stripe
          </div>
          <div
            style={{
              flex: 1,
              border: `1px solid ${colors.border}`,
              borderRadius: radii.lg,
              padding: 16,
              fontWeight: 700,
              fontSize: 14,
              color: colors.textFaint,
              background: colors.surface,
              cursor: 'not-allowed',
              opacity: 0.6
            }}
          >
            PayPal <span style={{ fontWeight: 600, fontSize: 11 }}>(coming soon)</span>
          </div>
        </div>
        {error && <div style={{ fontSize: 13, color: colors.danger, marginBottom: 14 }}>{error}</div>}
        <button
          onClick={completeCheckout}
          disabled={details.length === 0 || submitting}
          style={{
            width: '100%',
            border: 'none',
            background: colors.primaryGradient,
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            padding: 16,
            borderRadius: radii.lg,
            cursor: details.length === 0 || submitting ? 'not-allowed' : 'pointer',
            opacity: details.length === 0 || submitting ? 0.5 : 1,
            boxShadow: shadows.primaryGlow
          }}
        >
          {submitting ? 'Redirecting to Stripe…' : `Pay $${total}`}
        </button>
      </div>
      <div style={{ background: colors.surfaceMuted, borderRadius: radii.xxl, padding: 24, height: 'fit-content' }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 16 }}>Order summary</div>
        {details.map((ci, idx) => (
          <div
            key={`${ci.productId}-${idx}`}
            style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}
          >
            <span>
              {ci.title} <span style={{ color: colors.textFaint }}>({ci.licenseLabel})</span>
            </span>
            <span style={{ fontWeight: 700 }}>${ci.price}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, paddingTop: 14 }}>
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
}
