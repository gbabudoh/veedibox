'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { LICENSE_MULT, LICENSE_META, UiLicense } from '@/lib/product-mapper';

export interface CartProductSnapshot {
  id: string;
  title: string;
  priceCents: number;
  previewUrl: string | null;
  hue: number;
}

export interface CartItem extends CartProductSnapshot {
  license: UiLicense;
}

export interface CartLineDetail {
  productId: string;
  title: string;
  previewUrl: string | null;
  hue: number;
  license: UiLicense;
  licenseLabel: string;
  price: number;
}

interface CartContextValue {
  items: CartItem[];
  cartOpen: boolean;
  addItem: (product: CartProductSnapshot, license?: UiLicense, openDrawer?: boolean) => void;
  removeItem: (index: number) => void;
  toggleCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  details: CartLineDetail[];
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'veedibox-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (product: CartProductSnapshot, license: UiLicense = 'personal', openDrawer = true) => {
    setItems((prev) => [...prev, { ...product, license }]);
    if (openDrawer) setCartOpen(true);
  };
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
  const toggleCart = () => setCartOpen((v) => !v);
  const closeCart = () => setCartOpen(false);
  const clearCart = () => setItems([]);

  const details = useMemo<CartLineDetail[]>(
    () =>
      items.map((ci) => ({
        productId: ci.id,
        title: ci.title,
        previewUrl: ci.previewUrl,
        hue: ci.hue,
        license: ci.license,
        licenseLabel: LICENSE_META[ci.license].label,
        price: Math.round((ci.priceCents / 100) * LICENSE_MULT[ci.license])
      })),
    [items]
  );

  const total = details.reduce((sum, d) => sum + d.price, 0);

  const value: CartContextValue = {
    items,
    cartOpen,
    addItem,
    removeItem,
    toggleCart,
    closeCart,
    clearCart,
    details,
    total,
    count: items.length
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
