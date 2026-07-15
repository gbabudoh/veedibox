'use client';

import { useCart } from '@/lib/cart/CartContext';
import { colors, radii } from '@/lib/theme';

export function CartButton() {
  const { count, toggleCart } = useCart();
  return (
    <button
      onClick={toggleCart}
      style={{
        position: 'relative',
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        borderRadius: radii.md,
        padding: '9px 14px',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}
    >
      Cart
      {count > 0 && (
        <span
          style={{
            background: colors.primaryGradient,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '1px 7px',
            borderRadius: radii.pill
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
