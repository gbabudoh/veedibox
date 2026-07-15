'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UIProduct, LICENSE_MULT, LICENSE_META, UiLicense, formatUSD } from '@/lib/product-mapper';
import { useCart } from '@/lib/cart/CartContext';
import { colors, radii, shadows } from '@/lib/theme';

const LICENSE_KEYS: UiLicense[] = ['personal', 'commercial', 'extended'];

export function LicenseSelector({ product }: { product: UIProduct }) {
  const [selected, setSelected] = useState<UiLicense>('personal');
  const { addItem } = useCart();
  const router = useRouter();

  const licensedPriceCents = Math.round(product.priceCents * LICENSE_MULT[selected]);
  const snapshot = { id: product.id, title: product.title, priceCents: product.priceCents, previewUrl: product.previewUrl, hue: product.hue };

  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Choose a licence</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
        {LICENSE_KEYS.map((key) => {
          const active = selected === key;
          const meta = LICENSE_META[key];
          return (
            <div
              key={key}
              onClick={() => setSelected(key)}
              style={{
                border: `2px solid ${active ? colors.primary : colors.border}`,
                background: active ? colors.primarySofter : colors.surface,
                borderRadius: radii.lg,
                padding: '14px 16px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{meta.label}</div>
                  <div style={{ fontSize: 12.5, color: colors.textMuted2 }}>{meta.desc}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>${formatUSD(Math.round(product.priceCents * LICENSE_MULT[key]))}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: colors.textMuted2, marginBottom: 16, lineHeight: 1.5 }}>
        Same high-res files at every tier — you&apos;re licensing usage rights, not file quality.
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 18 }}>${formatUSD(licensedPriceCents)}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => addItem(snapshot, selected)}
          style={{
            flex: 1,
            border: `1px solid ${colors.borderStrong}`,
            background: colors.surface,
            fontWeight: 700,
            fontSize: 15,
            padding: 15,
            borderRadius: radii.lg,
            cursor: 'pointer'
          }}
        >
          Add to cart
        </button>
        <button
          onClick={() => {
            addItem(snapshot, selected, false);
            router.push('/checkout');
          }}
          style={{
            flex: 1,
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
          Buy now
        </button>
      </div>
    </div>
  );
}
