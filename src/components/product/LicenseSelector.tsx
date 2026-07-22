'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UIProduct, LICENSE_MULT, LICENSE_META, SELECTABLE_LICENSES, UiLicense, formatUSD } from '@/lib/product-mapper';
import { useCart } from '@/lib/cart/CartContext';
import { colors, fonts, radii, shadows } from '@/lib/theme';

export function LicenseSelector({ product }: { product: UIProduct }) {
  const [selected, setSelected] = useState<UiLicense>('personal');
  const [hoveredRow, setHoveredRow] = useState<UiLicense | null>(null);
  
  const [cartHovered, setCartHovered] = useState(false);
  const [cartActive, setCartActive] = useState(false);
  const [buyHovered, setBuyHovered] = useState(false);
  const [buyActive, setBuyActive] = useState(false);

  const { addItem } = useCart();
  const router = useRouter();

  const licensedPriceCents = Math.round(product.priceCents * LICENSE_MULT[selected]);
  const snapshot = { id: product.id, title: product.title, priceCents: product.priceCents, previewUrl: product.previewUrl, hue: product.hue };

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 13.5, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted2, marginBottom: 12 }}>Choose a licence</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
        {SELECTABLE_LICENSES.map((key) => {
          const active = selected === key;
          const rowHovered = hoveredRow === key;
          const meta = LICENSE_META[key];
          return (
            <div
              key={key}
              onClick={() => setSelected(key)}
              onMouseEnter={() => setHoveredRow(key)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                border: `2px solid ${active ? colors.primary : (rowHovered ? colors.borderStrong : colors.border)}`,
                background: active ? colors.primarySofter : (rowHovered ? 'oklch(96% 0.008 85)' : colors.surface),
                borderRadius: radii.lg,
                padding: '14px 16px',
                cursor: 'pointer',
                transform: rowHovered ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: active ? '0 4px 12px oklch(58% 0.16 265 / 0.08)' : (rowHovered ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'),
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `2px solid ${active ? colors.primary : colors.borderStrong}`,
                  background: active ? '#fff' : 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginRight: 14,
                  transition: 'all 0.2s ease'
                }}>
                  {active && (
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: colors.primary
                    }} />
                  )}
                </span>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{meta.label}</div>
                    <div style={{ fontSize: 12.5, color: colors.textMuted2, marginTop: 2 }}>{meta.desc}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: colors.text }}>${formatUSD(Math.round(product.priceCents * LICENSE_MULT[key]))}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 600,
          color: colors.primary,
          background: colors.primarySofter,
          border: `1px solid ${colors.primarySoft}`,
          borderRadius: radii.md,
          padding: '10px 12px',
          marginBottom: 20,
          lineHeight: 1.4
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
        You get the same files either way — this only covers how you&apos;re allowed to use them.
      </div>

      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: fonts.heading, letterSpacing: -0.5, marginBottom: 22 }}>
        ${formatUSD(licensedPriceCents)}
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        <button
          onClick={() => addItem(snapshot, selected)}
          onMouseEnter={() => setCartHovered(true)}
          onMouseLeave={() => {
            setCartHovered(false);
            setCartActive(false);
          }}
          onMouseDown={() => setCartActive(true)}
          onMouseUp={() => setCartActive(false)}
          style={{
            flex: 1,
            border: `1px solid ${cartHovered ? colors.primary : colors.borderStrong}`,
            background: cartHovered ? colors.primarySoft : colors.surface,
            color: cartHovered ? colors.primary : colors.text,
            fontWeight: 700,
            fontSize: 14.5,
            padding: 15,
            borderRadius: radii.lg,
            cursor: 'pointer',
            transform: cartActive ? 'scale(0.96)' : (cartHovered ? 'scale(1.02)' : 'scale(1)'),
            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          Add to cart
        </button>
        <button
          onClick={() => {
            addItem(snapshot, selected, false);
            router.push('/checkout');
          }}
          onMouseEnter={() => setBuyHovered(true)}
          onMouseLeave={() => {
            setBuyHovered(false);
            setBuyActive(false);
          }}
          onMouseDown={() => setBuyActive(true)}
          onMouseUp={() => setBuyActive(false)}
          style={{
            flex: 1,
            border: 'none',
            background: colors.primaryGradient,
            color: '#fff',
            fontWeight: 700,
            fontSize: 14.5,
            padding: 15,
            borderRadius: radii.lg,
            cursor: 'pointer',
            boxShadow: buyHovered ? '0 12px 28px oklch(58% 0.16 265 / 0.35)' : shadows.primaryGlow,
            transform: buyActive ? 'scale(0.96)' : (buyHovered ? 'scale(1.02)' : 'scale(1)'),
            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
