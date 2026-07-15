'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import { colors, fonts, maxWidth, radii, shadows } from '@/lib/theme';
import { PreviewTile } from '@/components/product/PreviewTile';

export default function CartPage() {
  const { details, total, removeItem } = useCart();

  return (
    <div style={{ maxWidth: maxWidth.checkout, margin: '0 auto', padding: '48px 32px 96px', animation: 'fadeIn 0.35s ease' }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 24px' }}>Your cart</h1>

      {details.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: colors.textFaint, fontSize: 14 }}>
          Your cart is empty. <Link href="/shop/all" style={{ color: colors.primary, fontWeight: 700 }}>Browse the shop →</Link>
        </div>
      ) : (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 24 }}>
          {details.map((ci, idx) => (
            <div
              key={`${ci.productId}-${idx}`}
              style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: `1px solid ${colors.borderSubtle}`, alignItems: 'center' }}
            >
              <PreviewTile previewUrl={ci.previewUrl} hue={ci.hue} alt={ci.title} containerStyle={{ width: 64, height: 64, borderRadius: radii.sm, flex: 'none' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ci.title}</div>
                <div style={{ fontSize: 12.5, color: colors.textFaint }}>{ci.licenseLabel}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>${ci.price}</div>
              <button
                onClick={() => removeItem(idx)}
                style={{ border: 'none', background: 'none', color: colors.neutral, cursor: 'pointer', fontSize: 14 }}
              >
                &times;
              </button>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, paddingTop: 20 }}>
            <span>Total</span>
            <span>${total}</span>
          </div>
          <Link
            href="/checkout"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 20,
              border: 'none',
              background: colors.primaryGradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              padding: 15,
              borderRadius: radii.lg,
              cursor: 'pointer',
              boxShadow: shadows.primaryGlow
            }}
          >
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
