'use client';

import { useRouter } from 'next/navigation';
import { UIProduct, formatUSD } from '@/lib/product-mapper';
import { useCart } from '@/lib/cart/CartContext';
import { colors, radii } from '@/lib/theme';
import { PreviewTile } from '@/components/product/PreviewTile';

export function ProductCard({ product }: { product: UIProduct }) {
  const router = useRouter();
  const { addItem } = useCart();

  return (
    <div
      onClick={() => router.push(`/product/${product.slug}`)}
      style={{
        cursor: 'pointer',
        borderRadius: radii.xxl,
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <PreviewTile previewUrl={product.previewUrl} hue={product.hue} alt={product.title} containerStyle={{ height: 170 }} />
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
            style={{
              border: `1px solid ${colors.borderStrong}`,
              background: colors.surface,
              fontWeight: 700,
              fontSize: 12,
              padding: '7px 12px',
              borderRadius: radii.sm,
              cursor: 'pointer'
            }}
          >
            Quick add
          </button>
        </div>
      </div>
    </div>
  );
}
