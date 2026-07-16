import Link from 'next/link';
import { getAboutContent } from '@/lib/about';
import { colors, fonts, bgFor, radii, shadows } from '@/lib/theme';

function PaletteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" />
      <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
      <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function LayoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

export default async function AboutPage() {
  const content = await getAboutContent();

  const valueCardStyle: React.CSSProperties = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.xl,
    padding: '24px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: shadows.card
  };

  const iconWrapStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 10,
    background: colors.primarySoft,
    color: colors.primary,
    flexShrink: 0
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 32px 96px', animation: 'fadeIn 0.35s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 56, alignItems: 'center', marginBottom: 64 }}>
        <div>
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
            {content.badgeText}
          </div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 44, fontWeight: 800, letterSpacing: -1.5, margin: '0 0 24px', lineHeight: 1.1 }}>
            {content.heading}
          </h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: colors.textMuted, margin: '0 0 20px' }}>
            {content.paragraph1}
          </p>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: colors.textMuted, margin: 0 }}>
            {content.paragraph2}
          </p>
        </div>
        <div style={{ position: 'relative', height: 320, borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 36px rgba(16, 24, 40, 0.08)' }}>
          <div style={{ ...bgFor(content.storyVisualHue), width: '100%', height: '100%' }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: 24
          }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{content.storyVisualTitle}</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{content.storyVisualSubtitle}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 56, marginBottom: 56 }}>
        <h2 style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, textAlign: 'center', marginBottom: 36 }}>
          Our Core Pillars
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          <div className="admin-card-hover" style={valueCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={iconWrapStyle}>
                <PaletteIcon />
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: colors.text }}>{content.pillar1Title}</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: colors.textMuted, margin: 0 }}>
              {content.pillar1Desc}
            </p>
          </div>

          <div className="admin-card-hover" style={valueCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={iconWrapStyle}>
                <CameraIcon />
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: colors.text }}>{content.pillar2Title}</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: colors.textMuted, margin: 0 }}>
              {content.pillar2Desc}
            </p>
          </div>

          <div className="admin-card-hover" style={valueCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={iconWrapStyle}>
                <LayoutIcon />
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: colors.text }}>{content.pillar3Title}</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: colors.textMuted, margin: 0 }}>
              {content.pillar3Desc}
            </p>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        background: colors.primaryGradient,
        padding: '52px 32px',
        borderRadius: 24,
        color: '#fff',
        boxShadow: shadows.primaryGlow
      }}>
        <h2 style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 12px' }}>
          {content.ctaHeading}
        </h2>
        <p style={{ fontSize: 15.5, opacity: 0.9, maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
          {content.ctaSubheading}
        </p>
        <Link
          href={content.ctaButtonHref}
          className="btn-interactive"
          style={{
            background: '#fff',
            color: colors.primary,
            fontWeight: 700,
            fontSize: 14.5,
            padding: '13px 26px',
            borderRadius: 12,
            display: 'inline-block',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}
        >
          {content.ctaButtonText}
        </Link>
      </div>
    </div>
  );
}
