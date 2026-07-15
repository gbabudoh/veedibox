'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart/CartContext';

// A confirmed paid order means the cart's contents have been purchased — clear it once, on mount.
export function ClearCartOnMount() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
