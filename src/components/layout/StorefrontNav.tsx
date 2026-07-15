import Link from 'next/link';
import { CartButton } from '@/components/cart/CartButton';
import { AuthNavLink } from '@/components/layout/AuthNavLink';
import { colors, fonts, maxWidth } from '@/lib/theme';

const CATEGORY_LINKS = [
  { href: '/shop/wall-art', label: 'Wall Art' },
  { href: '/shop/stock', label: 'Stock Images' },
  { href: '/shop/templates', label: 'Templates' },
  { href: '/shop/bundles', label: 'Bundles' }
];

export function StorefrontNav() {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'oklch(99% 0.006 85 / 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${colors.border}`
      }}
    >
      <div style={{ maxWidth: maxWidth.page, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link href="/" style={{ cursor: 'pointer', fontFamily: fonts.heading, fontWeight: 800, fontSize: 21, letterSpacing: -0.4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: colors.heroGradient, display: 'inline-block' }} />
          Veedibox
        </Link>
        <div style={{ display: 'flex', gap: 24, fontSize: 14.5, fontWeight: 600, color: colors.textMuted }}>
          {CATEGORY_LINKS.map((c) => (
            <Link key={c.href} href={c.href} style={{ cursor: 'pointer' }}>
              {c.label}
            </Link>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <AuthNavLink />
          <CartButton />
        </div>
      </div>
    </div>
  );
}
