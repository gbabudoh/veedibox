import Link from 'next/link';
import { colors, fonts, maxWidth } from '@/lib/theme';

export function Footer() {
  return (
    <div style={{ background: colors.surfaceMuted, borderTop: `1px solid ${colors.border}`, color: colors.text, padding: '56px 32px 32px' }}>
      <div
        style={{
          maxWidth: maxWidth.page,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: 40
        }}
      >
        <div>
          <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 19, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <img src="/favicon.png" alt="Veedibox logo" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            Veedibox
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: colors.textMuted, margin: 0, maxWidth: 320 }}>
            Modern art and usable visuals in one place — for decor, branding, and content.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.primary, marginBottom: 14 }}>
            Shop
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: colors.textMuted }}>
            <Link href="/shop/wall-art">Wall Art</Link>
            <Link href="/shop/stock">Stock Images</Link>
            <Link href="/shop/templates">Templates</Link>
            <Link href="/shop/bundles">Bundles</Link>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.primary, marginBottom: 14 }}>
            Company
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: colors.textMuted }}>
            <Link href="/about">About</Link>
            <Link href="/licensing">Licensing &amp; Usage</Link>
            <Link href="/support">Support</Link>
          </div>
        </div>
      </div>
      <div
        style={{
          maxWidth: maxWidth.page,
          margin: '40px auto 0',
          paddingTop: 20,
          borderTop: `1px solid ${colors.borderSubtle}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          fontSize: 12.5,
          color: colors.textFaint
        }}
      >
        <span>© 2026 Veedibox — Modern art &amp; creative assets.</span>
        <span>Veedibox is a subsidiary of Egobas Limited</span>
      </div>
    </div>
  );
}
