'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageContentData, HeroTile } from '@/lib/homepage';
import { Input } from '@/components/ui/Input';
import { colors, fonts, radii, bgFor } from '@/lib/theme';

type UploadState = 'idle' | 'uploading' | 'error';

async function uploadPreview(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('kind', 'preview');
  const res = await fetch('/api/admin/uploads', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.objectKey as string;
}

function fieldLabelStyle() {
  return { fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: colors.text };
}

function TileEditor({
  index,
  tile,
  uploadState,
  onChange,
  onUpload,
  onRemoveImage
}: {
  index: number;
  tile: HeroTile;
  uploadState: UploadState;
  onChange: (tile: HeroTile) => void;
  onUpload: (file: File | undefined) => void;
  onRemoveImage: () => void;
}) {
  return (
    <div style={{ border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.md, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: colors.textFaint }}>Tile {index + 1}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: radii.sm, overflow: 'hidden', flexShrink: 0, ...bgFor(tile.hue) }} title={tile.imageKey ? 'Gradient shown here; real image renders on the live homepage' : 'Gradient placeholder'} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label
            className="admin-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1.5px dashed ${colors.borderStrong}`,
              borderRadius: radii.md,
              padding: '10px 12px',
              cursor: 'pointer',
              background: colors.surfaceMuted,
              fontSize: 12.5,
              fontWeight: 700,
              color: colors.textFaint
            }}
          >
            <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} style={{ display: 'none' }} />
            {uploadState === 'uploading' ? 'Uploading…' : uploadState === 'error' ? 'Upload failed — try again' : tile.imageKey ? 'Replace image' : 'Upload image'}
          </label>
          {tile.imageKey && (
            <button
              onClick={onRemoveImage}
              className="admin-btn"
              style={{ border: `1px solid ${colors.dangerBorder}`, color: colors.danger, background: colors.surface, fontSize: 11.5, fontWeight: 700, padding: '6px 10px', borderRadius: 7, cursor: 'pointer', alignSelf: 'flex-start' }}
            >
              Remove image (use gradient)
            </button>
          )}
        </div>
      </div>
      <div>
        <div style={fieldLabelStyle()}>Fallback gradient hue (0-360, used when no image is uploaded)</div>
        <Input
          type="number"
          min={0}
          max={360}
          value={tile.hue}
          onChange={(e) => onChange({ ...tile, hue: Math.max(0, Math.min(360, Number(e.target.value) || 0)) })}
        />
      </div>
    </div>
  );
}

export function HomepageContentClient({ initialContent }: { initialContent: HomepageContentData }) {
  const [draft, setDraft] = useState<HomepageContentData>(initialContent);
  const [uploadStates, setUploadStates] = useState<UploadState[]>(initialContent.heroTiles.map(() => 'idle'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const setUploadState = (idx: number, state: UploadState) => {
    setUploadStates((prev) => prev.map((s, i) => (i === idx ? state : s)));
  };

  const setTile = (idx: number, tile: HeroTile) => {
    setDraft((prev) => ({ ...prev, heroTiles: prev.heroTiles.map((t, i) => (i === idx ? tile : t)) }));
  };

  const handleTileUpload = async (idx: number, file: File | undefined) => {
    if (!file) return;
    setUploadState(idx, 'uploading');
    try {
      const objectKey = await uploadPreview(file);
      setTile(idx, { ...draft.heroTiles[idx], imageKey: objectKey });
      setUploadState(idx, 'idle');
    } catch {
      setUploadState(idx, 'error');
    }
  };

  const canSave =
    draft.badgeText.trim().length > 0 &&
    draft.heading.trim().length > 0 &&
    draft.subheading.trim().length > 0 &&
    draft.primaryButtonText.trim().length > 0 &&
    draft.primaryButtonHref.trim().length > 0 &&
    draft.secondaryButtonText.trim().length > 0 &&
    draft.secondaryButtonHref.trim().length > 0 &&
    !uploadStates.some((s) => s === 'uploading') &&
    !saving;

  const save = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    const res = await fetch('/api/admin/homepage', {
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

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.3 }}>Homepage hero</h1>
      <div style={{ fontSize: 13, color: colors.textFaint, marginBottom: 24 }}>
        Edit the badge, heading, subheading, buttons, and 3 hero tiles shown at the top of the homepage.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={fieldLabelStyle()}>Badge text</div>
          <Input value={draft.badgeText} onChange={(e) => setDraft({ ...draft, badgeText: e.target.value })} />
        </div>
        <div>
          <div style={fieldLabelStyle()}>Heading</div>
          <textarea
            value={draft.heading}
            onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
            rows={2}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: radii.md, border: `1px solid ${colors.borderStrong}`, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>
        <div>
          <div style={fieldLabelStyle()}>Subheading</div>
          <textarea
            value={draft.subheading}
            onChange={(e) => setDraft({ ...draft, subheading: e.target.value })}
            rows={3}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: radii.md, border: `1px solid ${colors.borderStrong}`, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 16 }}>
          <div>
            <div style={fieldLabelStyle()}>Primary button text</div>
            <Input value={draft.primaryButtonText} onChange={(e) => setDraft({ ...draft, primaryButtonText: e.target.value })} />
          </div>
          <div>
            <div style={fieldLabelStyle()}>Primary button link</div>
            <Input value={draft.primaryButtonHref} onChange={(e) => setDraft({ ...draft, primaryButtonHref: e.target.value })} placeholder="/shop/all" />
          </div>
          <div>
            <div style={fieldLabelStyle()}>Secondary button text</div>
            <Input value={draft.secondaryButtonText} onChange={(e) => setDraft({ ...draft, secondaryButtonText: e.target.value })} />
          </div>
          <div>
            <div style={fieldLabelStyle()}>Secondary button link</div>
            <Input value={draft.secondaryButtonHref} onChange={(e) => setDraft({ ...draft, secondaryButtonHref: e.target.value })} placeholder="/dashboard" />
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5 }}>Hero tiles</div>
          {draft.heroTiles.map((tile, idx) => (
            <TileEditor
              key={idx}
              index={idx}
              tile={tile}
              uploadState={uploadStates[idx] ?? 'idle'}
              onChange={(next) => setTile(idx, next)}
              onUpload={(file) => handleTileUpload(idx, file)}
              onRemoveImage={() => setTile(idx, { ...tile, imageKey: null })}
            />
          ))}
        </div>
      </div>

      {error && <div style={{ fontSize: 13, color: colors.danger, marginTop: 16 }}>{error}</div>}
      {saved && !error && <div style={{ fontSize: 13, color: colors.success, marginTop: 16 }}>Saved.</div>}

      <button
        onClick={save}
        disabled={!canSave}
        className="admin-btn"
        style={{
          marginTop: 20,
          border: 'none',
          background: colors.primaryGradient,
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          padding: '13px 22px',
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
