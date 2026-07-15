import { colors, fonts } from '@/lib/theme';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 32px 96px', animation: 'fadeIn 0.35s ease' }}>
      <div
        style={{
          display: 'inline-block',
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: colors.primary,
          background: colors.primarySoft,
          padding: '6px 12px',
          borderRadius: 999,
          marginBottom: 20
        }}
      >
        About Veedibox
      </div>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 38, fontWeight: 800, letterSpacing: -1, margin: '0 0 20px' }}>
        Modern art and usable visuals, in one place.
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: colors.textMuted, margin: '0 0 20px' }}>
        Veedibox is an online marketplace for modern art and creative assets — digital paintings, stock imagery, and
        templates, with room to grow into wallpapers, merch-ready designs, and brand kits. We built it for founders,
        creatives, and everyday buyers who want high-quality visual content they can actually use, not just admire.
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: colors.textMuted, margin: '0 0 20px' }}>
        Most platforms make you choose: a curated gallery for beautiful work, or a practical stock library for
        downloads you can drop into real projects. Veedibox combines both, so you can discover original art and grab
        the assets you need for decor, branding, and content — all in the same place.
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: colors.textMuted, margin: 0 }}>
        Every piece on Veedibox is chosen or made with one question in mind: will this actually get used — printed on
        a wall, dropped into a pitch deck, posted to a feed? That&apos;s the standard, and it&apos;s why our stock has
        soul instead of feeling generic.
      </p>
    </div>
  );
}
