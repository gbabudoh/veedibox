'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UIProduct, formatUSD } from '@/lib/product-mapper';
import { useCart } from '@/lib/cart/CartContext';
import { colors, radii, shadows } from '@/lib/theme';
import { PreviewTile } from '@/components/product/PreviewTile';

export function ProductCard({ product }: { product: UIProduct }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [btnActive, setBtnActive] = useState(false);

  return (
    <div
      onClick={() => router.push(`/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setBtnHovered(false);
        setBtnActive(false);
      }}
      style={{
        cursor: 'pointer',
        borderRadius: radii.xxl,
        overflow: 'hidden',
        border: `1px solid ${hovered ? colors.primary : colors.border}`,
        background: colors.surface,
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? shadows.cardLift : shadows.card,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease'
      }}
    >
      <PreviewTile
        previewUrl={product.previewUrl}
        hue={product.hue}
        alt={product.title}
        containerStyle={{ height: 170 }}
        hovered={hovered}
      />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {product.style}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3 }}>{product.title}</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>${formatUSD(product.priceCents)}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem({ id: product.id, title: product.title, priceCents: product.priceCents, previewUrl: product.previewUrl, hue: product.hue });
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => {
              setBtnHovered(false);
              setBtnActive(false);
            }}
            onMouseDown={() => setBtnActive(true)}
            onMouseUp={() => setBtnActive(false)}
            style={{
              border: `1px solid ${btnHovered ? colors.primary : colors.borderStrong}`,
              background: btnHovered ? colors.primary : colors.surface,
              color: btnHovered ? '#fff' : colors.text,
              fontWeight: 700,
              fontSize: 12,
              padding: '7px 12px',
              borderRadius: radii.sm,
              cursor: 'pointer',
              transform: btnActive ? 'scale(0.95)' : (btnHovered ? 'scale(1.03)' : 'scale(1)'),
              transition: 'all 0.15s ease'
            }}
          >
            Quick add
          </button>
        </div>
      </div>
    </div>
  );
}
