import { colors, fonts, radii } from '@/lib/theme';

const FAQS = [
  {
    q: 'How do I get my files after purchase?',
    a: 'Right after checkout you land on a confirmation page with a link to your download library. We also email a receipt with the same links.'
  },
  {
    q: 'Where can I find my past purchases?',
    a: 'Go to My Veedibox → Purchases for your order history, or My Veedibox → Downloads to re-download any file you own.'
  },
  {
    q: 'What licence should I buy?',
    a: 'Personal is for home/personal decor, Commercial covers branding/social/web for one business, and Extended adds resale and merch rights. See the Licensing & Usage page for details.'
  },
  {
    q: 'Do you offer refunds?',
    a: 'Because these are digital downloads, refunds are considered case-by-case — for example if a file is corrupted or materially not as described. Contact us within 7 days of purchase.'
  }
];

export default function SupportPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 32px 96px', animation: 'fadeIn 0.35s ease' }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 32, fontWeight: 800, letterSpacing: -0.6, margin: '0 0 16px' }}>Support</h1>
      <p style={{ fontSize: 15.5, lineHeight: 1.7, color: colors.textMuted, margin: '0 0 32px' }}>
        Questions about an order, a download, or a licence? Start with the FAQ below, or reach us directly.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
        {FAQS.map((f) => (
          <div key={f.q} style={{ border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: '18px 20px', background: colors.surface }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>{f.q}</div>
            <div style={{ fontSize: 13.5, color: colors.textMuted, lineHeight: 1.6 }}>{f.a}</div>
          </div>
        ))}
      </div>

      <div style={{ background: colors.surfaceMuted, borderRadius: radii.xl, padding: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>Still need help?</div>
        <p style={{ fontSize: 13.5, color: colors.textMuted, margin: 0 }}>
          Email us at <a href="mailto:support@veedibox.com" style={{ color: colors.primary, fontWeight: 700 }}>support@veedibox.com</a> and we&apos;ll get back to you within one business day.
        </p>
      </div>
    </div>
  );
}
