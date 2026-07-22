import { LICENSE_META, LICENSE_MULT, SELECTABLE_LICENSES } from '@/lib/product-mapper';
import { colors, fonts, radii } from '@/lib/theme';

export default function LicensingPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 32px 96px', animation: 'fadeIn 0.35s ease' }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 32, fontWeight: 800, letterSpacing: -0.6, margin: '0 0 16px' }}>Licensing &amp; Usage</h1>
      <p style={{ fontSize: 15.5, lineHeight: 1.7, color: colors.textMuted, margin: '0 0 32px' }}>
        Every product on Veedibox is available under two licence options. Pick the one that matches how you plan to
        use the file — you get the same files either way, this only covers usage rights.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {SELECTABLE_LICENSES.map((key) => {
          const meta = LICENSE_META[key];
          return (
            <div key={key} style={{ border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 22, background: colors.surface }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{meta.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary }}>{LICENSE_MULT[key]}× base price</div>
              </div>
              <p style={{ fontSize: 14.5, color: colors.textMuted, margin: 0, lineHeight: 1.6 }}>{meta.desc}</p>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 13.5, color: colors.textFaint, marginTop: 28, lineHeight: 1.7 }}>
        Personal use covers home and personal projects only. Business use adds branding, marketing, resale, and
        commercial projects for a single brand or business. If you&apos;re unsure which option fits your project,
        reach out via Support before purchasing.
      </p>
    </div>
  );
}
