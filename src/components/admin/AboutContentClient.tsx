'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AboutPageContentData } from '@/lib/about';
import { Input } from '@/components/ui/Input';
import { colors, fonts, radii, bgFor } from '@/lib/theme';

function fieldLabelStyle() {
  return { fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: colors.text };
}

function sectionTitleStyle() {
  return { fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.primary, borderBottom: `1px solid ${colors.border}`, paddingBottom: 6, marginBottom: 14 };
}

export function AboutContentClient({ initialContent }: { initialContent: AboutPageContentData }) {
  const [draft, setDraft] = useState<AboutPageContentData>(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const canSave =
    draft.badgeText.trim().length > 0 &&
    draft.heading.trim().length > 0 &&
    draft.paragraph1.trim().length > 0 &&
    draft.paragraph2.trim().length > 0 &&
    draft.storyVisualTitle.trim().length > 0 &&
    draft.storyVisualSubtitle.trim().length > 0 &&
    draft.pillar1Title.trim().length > 0 &&
    draft.pillar1Desc.trim().length > 0 &&
    draft.pillar2Title.trim().length > 0 &&
    draft.pillar2Desc.trim().length > 0 &&
    draft.pillar3Title.trim().length > 0 &&
    draft.pillar3Desc.trim().length > 0 &&
    draft.ctaHeading.trim().length > 0 &&
    draft.ctaSubheading.trim().length > 0 &&
    draft.ctaButtonText.trim().length > 0 &&
    draft.ctaButtonHref.trim().length > 0 &&
    !saving;

  const save = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    const res = await fetch('/api/admin/about', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft)
    });
    setSaving(false);
    if (!res.ok) {
      setError('Could not save. Check the fields and try again.');
      return;
    }
    setSaved(true);
    router.refresh();
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: radii.md,
    border: `1px solid ${colors.borderStrong}`,
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical'
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.3 }}>About page content</h1>
      <div style={{ fontSize: 13, color: colors.textFaint, marginBottom: 28 }}>
        Edit the badge text, headings, story visuals, core pillars grid, and call to action block on the About page.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Intro section */}
        <div>
          <div style={sectionTitleStyle() as any}>1. Intro Section</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={fieldLabelStyle()}>Badge text</div>
              <Input value={draft.badgeText} onChange={(e) => setDraft({ ...draft, badgeText: e.target.value })} />
            </div>
            <div>
              <div style={fieldLabelStyle()}>Main heading</div>
              <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
            </div>
            <div>
              <div style={fieldLabelStyle()}>Story paragraph 1</div>
              <textarea
                value={draft.paragraph1}
                onChange={(e) => setDraft({ ...draft, paragraph1: e.target.value })}
                rows={4}
                style={textareaStyle}
              />
            </div>
            <div>
              <div style={fieldLabelStyle()}>Story paragraph 2</div>
              <textarea
                value={draft.paragraph2}
                onChange={(e) => setDraft({ ...draft, paragraph2: e.target.value })}
                rows={4}
                style={textareaStyle}
              />
            </div>
          </div>
        </div>

        {/* Visual card section */}
        <div>
          <div style={sectionTitleStyle() as any}>2. Story Visual Card (Right Side)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: radii.md, overflow: 'hidden', flexShrink: 0, ...bgFor(draft.storyVisualHue) }} />
              <div style={{ flex: 1 }}>
                <div style={fieldLabelStyle()}>Visual gradient hue (0-360)</div>
                <Input
                  type="number"
                  min={0}
                  max={360}
                  value={draft.storyVisualHue}
                  onChange={(e) => setDraft({ ...draft, storyVisualHue: Math.max(0, Math.min(360, Number(e.target.value) || 0)) })}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={fieldLabelStyle()}>Visual card title</div>
                <Input value={draft.storyVisualTitle} onChange={(e) => setDraft({ ...draft, storyVisualTitle: e.target.value })} />
              </div>
              <div>
                <div style={fieldLabelStyle()}>Visual card subtitle</div>
                <Input value={draft.storyVisualSubtitle} onChange={(e) => setDraft({ ...draft, storyVisualSubtitle: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Pillars section */}
        <div>
          <div style={sectionTitleStyle() as any}>3. Core Pillars (3 Columns)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Pillar 1 */}
            <div style={{ border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.md, padding: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: colors.textMuted2, marginBottom: 10 }}>Pillar 1 (Left)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={fieldLabelStyle()}>Pillar title</div>
                  <Input value={draft.pillar1Title} onChange={(e) => setDraft({ ...draft, pillar1Title: e.target.value })} />
                </div>
                <div>
                  <div style={fieldLabelStyle()}>Pillar description</div>
                  <textarea
                    value={draft.pillar1Desc}
                    onChange={(e) => setDraft({ ...draft, pillar1Desc: e.target.value })}
                    rows={2}
                    style={textareaStyle}
                  />
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div style={{ border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.md, padding: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: colors.textMuted2, marginBottom: 10 }}>Pillar 2 (Center)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={fieldLabelStyle()}>Pillar title</div>
                  <Input value={draft.pillar2Title} onChange={(e) => setDraft({ ...draft, pillar2Title: e.target.value })} />
                </div>
                <div>
                  <div style={fieldLabelStyle()}>Pillar description</div>
                  <textarea
                    value={draft.pillar2Desc}
                    onChange={(e) => setDraft({ ...draft, pillar2Desc: e.target.value })}
                    rows={2}
                    style={textareaStyle}
                  />
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div style={{ border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.md, padding: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: colors.textMuted2, marginBottom: 10 }}>Pillar 3 (Right)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={fieldLabelStyle()}>Pillar title</div>
                  <Input value={draft.pillar3Title} onChange={(e) => setDraft({ ...draft, pillar3Title: e.target.value })} />
                </div>
                <div>
                  <div style={fieldLabelStyle()}>Pillar description</div>
                  <textarea
                    value={draft.pillar3Desc}
                    onChange={(e) => setDraft({ ...draft, pillar3Desc: e.target.value })}
                    rows={2}
                    style={textareaStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div>
          <div style={sectionTitleStyle() as any}>4. Call to Action Footer Banner</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={fieldLabelStyle()}>CTA Heading</div>
              <Input value={draft.ctaHeading} onChange={(e) => setDraft({ ...draft, ctaHeading: e.target.value })} />
            </div>
            <div>
              <div style={fieldLabelStyle()}>CTA Subheading</div>
              <textarea
                value={draft.ctaSubheading}
                onChange={(e) => setDraft({ ...draft, ctaSubheading: e.target.value })}
                rows={2}
                style={textareaStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={fieldLabelStyle()}>Button text</div>
                <Input value={draft.ctaButtonText} onChange={(e) => setDraft({ ...draft, ctaButtonText: e.target.value })} />
              </div>
              <div>
                <div style={fieldLabelStyle()}>Button link</div>
                <Input value={draft.ctaButtonHref} onChange={(e) => setDraft({ ...draft, ctaButtonHref: e.target.value })} placeholder="/shop/all" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div style={{ fontSize: 13, color: colors.danger, marginTop: 20 }}>{error}</div>}
      {saved && !error && <div style={{ fontSize: 13, color: colors.success, marginTop: 20 }}>Saved successfully.</div>}

      <button
        onClick={save}
        disabled={!canSave}
        className="admin-btn"
        style={{
          marginTop: 24,
          border: 'none',
          background: colors.primaryGradient,
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          padding: '13px 24px',
          borderRadius: radii.md,
          cursor: canSave ? 'pointer' : 'not-allowed',
          opacity: canSave ? 1 : 0.5
        }}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}
