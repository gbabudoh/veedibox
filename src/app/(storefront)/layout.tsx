import { CartProvider } from '@/lib/cart/CartContext';
import { ConditionalNav } from '@/components/layout/ConditionalNav';
import { ConditionalFooter } from '@/components/layout/ConditionalFooter';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ContentProtection } from '@/components/layout/ContentProtection';
import { colors } from '@/lib/theme';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ContentProtection />
      <div style={{ background: colors.appBg, minHeight: '100vh' }}>
        <ConditionalNav />
        {children}
        <ConditionalFooter />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
