'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';
import { colors, radii, shadows } from '@/lib/theme';
import { PreviewTile } from '@/components/product/PreviewTile';

export function CartDrawer() {
  const { cartOpen, closeCart, details, total, removeItem, toggleCart } = useCart();
  const router = useRouter();

  if (!cartOpen) return null;

  return (
    <>
      <div onClick={closeCart} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200 }} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 400,
          maxWidth: '100vw',
          background: colors.surface,
          zIndex: 201,
          boxShadow: shadows.drawer,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.25s ease'
        }}
      >
        <div
          style={{
            padding: '22px 24px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16 }}>Your cart</div>
          <button onClick={closeCart} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer' }}>
            &times;
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {details.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: colors.textFaint, fontSize: 13.5 }}>
              Your cart is empty.
            </div>
          )}
          {details.map((ci, idx) => (
            <div
              key={`${ci.productId}-${idx}`}
              style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: `1px solid ${colors.borderSubtle}` }}
            >
              <PreviewTile previewUrl={ci.previewUrl} hue={ci.hue} alt={ci.title} containerStyle={{ width: 56, height: 56, borderRadius: radii.sm, flex: 'none' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{ci.title}</div>
                <div style={{ fontSize: 12, color: colors.textFaint }}>{ci.licenseLabel}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>${ci.price}</div>
              <button
                onClick={() => removeItem(idx)}
                style={{ border: 'none', background: 'none', color: colors.neutral, cursor: 'pointer', fontSize: 13 }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px 24px', borderTop: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, marginBottom: 14 }}>
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button
            onClick={() => {
              toggleCart();
              router.push('/checkout');
            }}
            style={{
              width: '100%',
              border: 'none',
              background: colors.primaryGradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              padding: 15,
              borderRadius: radii.lg,
              cursor: 'pointer'
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
