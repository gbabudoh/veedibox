'use client';

import { useState } from 'react';
import { UrlCategory, CATEGORY_LABELS } from '@/lib/product-mapper';
import { CATEGORY_METADATA_FIELDS } from '@/lib/category-fields';
import { Input } from '@/components/ui/Input';
import { colors, fonts, radii, shadows } from '@/lib/theme';

export interface ProductFileDraft {
  label: string;
  kind: 'DIGITAL' | 'PRINT';
  fileKey: string;
  fileSizeMb: number;
}

export interface ProductFormDraft {
  title: string;
  category: UrlCategory;
  style: string;
  price: number;
  description: string;
  previewKey: string;
  metadata: Record<string, string | number | string[]>;
  isAiGenerated: boolean;
  files: ProductFileDraft[];
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error';

async function uploadFile(file: File, kind: 'preview' | 'original'): Promise<{ objectKey: string; sizeMb: number }> {
  const form = new FormData();
  form.append('file', file);
  form.append('kind', kind);
  const res = await fetch('/api/admin/uploads', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return { objectKey: data.objectKey as string, sizeMb: Math.max(1, Math.round(file.size / (1024 * 1024))) };
}

function fieldLabelStyle() {
  return { fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: colors.text };
}

function UploadField({
  label,
  accept,
  state,
  hasValue,
  onSelect
}: {
  label: string;
  accept?: string;
  state: UploadState;
  hasValue: boolean;
  onSelect: (file: File | undefined) => void;
}) {
  const borderColor = state === 'error' ? colors.dangerBorder : hasValue ? colors.primary : colors.borderStrong;
  return (
    <div>
      {label && <div style={fieldLabelStyle()}>{label}</div>}
      <label
        className="admin-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          border: `1.5px dashed ${borderColor}`,
          borderRadius: radii.md,
          padding: '14px 12px',
          cursor: 'pointer',
          background: hasValue ? colors.primarySofter : colors.surfaceMuted,
          fontSize: 12.5,
          fontWeight: 700,
          color: state === 'error' ? colors.danger : hasValue ? colors.primary : colors.textFaint
        }}
      >
        <input type="file" accept={accept} onChange={(e) => onSelect(e.target.files?.[0])} style={{ display: 'none' }} />
        {state === 'uploading' && 'Uploading…'}
        {state === 'done' && '✓ Uploaded — click to replace'}
        {state === 'error' && 'Upload failed — click to try again'}
        {state === 'idle' && 'Click to choose a file'}
      </label>
    </div>
  );
}

function FileRow({
  file,
  uploadState,
  onChange,
  onUpload,
  onRemove
}: {
  file: ProductFileDraft;
  uploadState: UploadState;
  onChange: (file: ProductFileDraft) => void;
  onUpload: (selected: File | undefined) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.md, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', gap: 8, alignItems: 'end' }}>
        <div>
          <div style={fieldLabelStyle()}>File label</div>
          <Input value={file.label} onChange={(e) => onChange({ ...file, label: e.target.value })} placeholder="e.g. JPG, Print PDF" />
        </div>
        <div>
          <div style={fieldLabelStyle()}>Type</div>
          <select
            value={file.kind}
            onChange={(e) => onChange({ ...file, kind: e.target.value as 'DIGITAL' | 'PRINT' })}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: radii.md, border: `1px solid ${colors.borderStrong}`, fontSize: 14 }}
          >
            <option value="DIGITAL">Digital</option>
            <option value="PRINT">Print</option>
          </select>
        </div>
        <button
          onClick={onRemove}
          className="admin-btn"
          title="Remove file"
          style={{ border: `1px solid ${colors.dangerBorder}`, color: colors.danger, background: colors.surface, fontSize: 12, fontWeight: 700, padding: '12px 12px', borderRadius: radii.md, cursor: 'pointer' }}
        >
          ×
        </button>
      </div>
      <UploadField label="" state={uploadState} hasValue={Boolean(file.fileKey)} onSelect={onUpload} />
    </div>
  );
}

function ListField({ items, placeholder, onChange }: { items: string[]; placeholder?: string; onChange: (items: string[]) => void }) {
  const update = (idx: number, value: string) => onChange(items.map((it, i) => (i === idx ? value : it)));
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, '']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 8 }}>
          <Input value={item} onChange={(e) => update(idx, e.target.value)} placeholder={placeholder} />
          <button
            onClick={() => remove(idx)}
            className="admin-btn"
            title="Remove item"
            style={{ border: `1px solid ${colors.dangerBorder}`, color: colors.danger, background: colors.surface, fontSize: 12, fontWeight: 700, padding: '0 12px', borderRadius: radii.md, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="admin-btn"
        style={{ alignSelf: 'flex-start', border: `1px solid ${colors.border}`, background: colors.surface, fontSize: 12, fontWeight: 700, padding: '6px 10px', borderRadius: 7, cursor: 'pointer' }}
      >
        + Add item
      </button>
    </div>
  );
}

export function ProductModal({
  title,
  draft,
  onChange,
  onCancel,
  onSave,
  saving
}: {
  title: string;
  draft: ProductFormDraft;
  onChange: (draft: ProductFormDraft) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [previewUpload, setPreviewUpload] = useState<UploadState>(draft.previewKey ? 'done' : 'idle');
  const [fileUploadStates, setFileUploadStates] = useState<UploadState[]>(draft.files.map((f) => (f.fileKey ? 'done' : 'idle')));
  const metadataFields = CATEGORY_METADATA_FIELDS[draft.category];

  const handlePreviewFile = async (file: File | undefined) => {
    if (!file) return;
    setPreviewUpload('uploading');
    try {
      const { objectKey } = await uploadFile(file, 'preview');
      onChange({ ...draft, previewKey: objectKey });
      setPreviewUpload('done');
    } catch {
      setPreviewUpload('error');
    }
  };

  const setFileUploadState = (idx: number, state: UploadState) => {
    setFileUploadStates((prev) => prev.map((s, i) => (i === idx ? state : s)));
  };

  const handleFileUpload = async (idx: number, selected: File | undefined) => {
    if (!selected) return;
    setFileUploadState(idx, 'uploading');
    try {
      const { objectKey, sizeMb } = await uploadFile(selected, 'original');
      const nextFiles = draft.files.map((f, i) => (i === idx ? { ...f, fileKey: objectKey, fileSizeMb: sizeMb } : f));
      onChange({ ...draft, files: nextFiles });
      setFileUploadState(idx, 'done');
    } catch {
      setFileUploadState(idx, 'error');
    }
  };

  const setMetadataField = (key: string, value: string) => {
    onChange({ ...draft, metadata: { ...draft.metadata, [key]: value } });
  };

  const addFileRow = () => {
    onChange({ ...draft, files: [...draft.files, { label: '', kind: 'DIGITAL', fileKey: '', fileSizeMb: 0 }] });
    setFileUploadStates((prev) => [...prev, 'idle']);
  };

  const removeFileRow = (idx: number) => {
    onChange({ ...draft, files: draft.files.filter((_, i) => i !== idx) });
    setFileUploadStates((prev) => prev.filter((_, i) => i !== idx));
  };

  const anyUploading = previewUpload === 'uploading' || fileUploadStates.some((s) => s === 'uploading');
  const canSave =
    draft.title.trim().length > 0 &&
    draft.previewKey.length > 0 &&
    draft.files.length > 0 &&
    draft.files.every((f) => f.fileKey.length > 0 && f.label.trim().length > 0) &&
    !anyUploading &&
    !saving;

  return (
    <>
      <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(16,20,30,0.45)', zIndex: 300, animation: 'fadeIn 0.15s ease' }} />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 560,
          maxWidth: '92vw',
          maxHeight: '86vh',
          overflow: 'auto',
          background: colors.surface,
          borderRadius: 20,
          zIndex: 301,
          padding: 28,
          boxShadow: shadows.modal,
          animation: 'modalIn 0.18s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 19, letterSpacing: -0.3 }}>{title}</div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.primary,
              background: colors.primarySoft,
              padding: '4px 10px',
              borderRadius: radii.pill,
              textTransform: 'uppercase',
              letterSpacing: 0.4
            }}
          >
            {CATEGORY_LABELS[draft.category]}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={fieldLabelStyle()}>Title</div>
            <Input value={draft.title} onChange={(e) => onChange({ ...draft, title: e.target.value })} />
          </div>
          <div>
            <div style={fieldLabelStyle()}>Style</div>
            <Input value={draft.style} onChange={(e) => onChange({ ...draft, style: e.target.value })} placeholder="e.g. Abstract, Minimalist" />
          </div>
          <div>
            <div style={fieldLabelStyle()}>Description</div>
            <textarea
              value={draft.description}
              onChange={(e) => onChange({ ...draft, description: e.target.value })}
              rows={3}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: radii.md, border: `1px solid ${colors.borderStrong}`, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
          <div>
            <div style={fieldLabelStyle()}>Price (USD)</div>
            <Input type="number" value={draft.price} onChange={(e) => onChange({ ...draft, price: Number(e.target.value) || 0 })} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: colors.text }}>
            <input
              type="checkbox"
              checked={draft.isAiGenerated}
              onChange={(e) => onChange({ ...draft, isAiGenerated: e.target.checked })}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            Generated with AI — disclose this to buyers on the product page
          </label>

          {metadataFields.length > 0 && (
            <div style={{ borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                {CATEGORY_LABELS[draft.category]} details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {metadataFields.filter((f) => f.type !== 'list').map((f) => (
                  <div key={f.key}>
                    <div style={fieldLabelStyle()}>{f.label}</div>
                    {f.type === 'select' ? (
                      <select
                        value={(draft.metadata[f.key] as string) ?? ''}
                        onChange={(e) => setMetadataField(f.key, e.target.value)}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: radii.md, border: `1px solid ${colors.borderStrong}`, fontSize: 14 }}
                      >
                        <option value="">—</option>
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={f.type === 'number' ? 'number' : 'text'}
                        value={(draft.metadata[f.key] as string | number) ?? ''}
                        onChange={(e) => setMetadataField(f.key, e.target.value)}
                        placeholder={f.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
              {metadataFields.filter((f) => f.type === 'list').map((f) => (
                <div key={f.key} style={{ marginTop: 12 }}>
                  <div style={fieldLabelStyle()}>{f.label}</div>
                  <ListField
                    items={(draft.metadata[f.key] as string[]) ?? []}
                    placeholder={f.placeholder}
                    onChange={(items) => onChange({ ...draft, metadata: { ...draft.metadata, [f.key]: items } })}
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 16 }}>
            <UploadField label="Preview image" accept="image/*" state={previewUpload} hasValue={Boolean(draft.previewKey)} onSelect={handlePreviewFile} />
          </div>

          <div style={{ borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Deliverable files
              </div>
              <button
                onClick={addFileRow}
                className="admin-btn"
                style={{ border: `1px solid ${colors.border}`, background: colors.surface, fontSize: 12, fontWeight: 700, padding: '6px 10px', borderRadius: 7, cursor: 'pointer' }}
              >
                + Add file
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {draft.files.map((f, idx) => (
                <FileRow
                  key={idx}
                  file={f}
                  uploadState={fileUploadStates[idx] ?? 'idle'}
                  onChange={(next) => onChange({ ...draft, files: draft.files.map((x, i) => (i === idx ? next : x)) })}
                  onUpload={(selected) => handleFileUpload(idx, selected)}
                  onRemove={() => removeFileRow(idx)}
                />
              ))}
              {draft.files.length === 0 && (
                <div style={{ fontSize: 12.5, color: colors.textFaint, textAlign: 'center', padding: '16px 0' }}>
                  No files yet — add at least one deliverable file.
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
          <button
            onClick={onCancel}
            className="admin-btn"
            style={{ flex: 1, border: `1px solid ${colors.borderStrong}`, background: colors.surface, fontWeight: 700, fontSize: 14, padding: 13, borderRadius: radii.md, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!canSave}
            className="admin-btn"
            style={{
              flex: 1,
              border: 'none',
              background: colors.primaryGradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              padding: 13,
              borderRadius: radii.md,
              cursor: canSave ? 'pointer' : 'not-allowed',
              opacity: canSave ? 1 : 0.5,
              boxShadow: canSave ? '0 4px 12px oklch(58% 0.16 265 / 0.22)' : 'none'
            }}
          >
            {saving ? 'Saving…' : 'Save product'}
          </button>
        </div>
      </div>
    </>
  );
}
