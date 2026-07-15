'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProduct, UrlCategory, CATEGORY_LABELS, CATEGORY_TO_DB, formatUSD } from '@/lib/product-mapper';
import { ProductModal, ProductFormDraft } from '@/components/admin/ProductModal';
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable';
import { ProductStatusToggle } from '@/components/admin/ProductStatusToggle';
import { PreviewTile } from '@/components/product/PreviewTile';
import { colors, fonts, radii } from '@/lib/theme';

const COLUMNS = [
  { label: '', width: '48px' },
  { label: 'Product', width: '2fr' },
  { label: 'Style', width: '1fr' },
  { label: 'Files', width: '70px' },
  { label: 'Price', width: '90px' },
  { label: 'Status', width: '150px' },
  { label: 'Actions', width: '140px' }
];

function emptyDraft(category: UrlCategory): ProductFormDraft {
  return {
    title: '',
    category,
    style: '',
    price: 20,
    description: '',
    formats: '',
    dimensions: '',
    previewKey: '',
    metadata: {},
    files: []
  };
}

export function AdminProductsClient({ category, initialProducts }: { category: UrlCategory; initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductFormDraft>(emptyDraft(category));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const openAddProduct = () => {
    setEditingId(null);
    setDraft(emptyDraft(category));
    setError('');
    setShowModal(true);
  };

  const openEditProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setDraft({
      title: p.title,
      category: p.category,
      style: p.style,
      price: Number(formatUSD(p.priceCents)),
      description: p.description,
      formats: p.formats,
      dimensions: p.dimensions,
      previewKey: p.previewKey,
      metadata: p.metadata ?? {},
      files: p.files.map((f) => ({ label: f.label, kind: f.kind, fileKey: f.fileKey, fileSizeMb: f.fileSizeMb }))
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const saveProduct = async () => {
    setSaving(true);
    setError('');
    const payload = {
      title: draft.title,
      description: draft.description,
      category: CATEGORY_TO_DB[draft.category],
      style: draft.style,
      price: Math.round(draft.price * 100),
      formats: draft.formats,
      dimensions: draft.dimensions,
      previewKey: draft.previewKey,
      metadata: draft.metadata,
      files: draft.files
    };

    const res = editingId
      ? await fetch(`/api/admin/products/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    setSaving(false);
    if (!res.ok) {
      setError('Could not save product. Check the fields and try again.');
      return;
    }
    setShowModal(false);
    router.refresh();
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{CATEGORY_LABELS[category]}</h1>
          <div style={{ fontSize: 13, color: colors.textFaint, marginTop: 4 }}>{products.length} product{products.length === 1 ? '' : 's'}</div>
        </div>
        <button
          onClick={openAddProduct}
          className="admin-btn"
          style={{ border: 'none', background: colors.primaryGradient, color: '#fff', fontWeight: 700, fontSize: 13.5, padding: '11px 18px', borderRadius: radii.md, cursor: 'pointer', boxShadow: '0 4px 12px oklch(58% 0.16 265 / 0.22)' }}
        >
          + Add {CATEGORY_LABELS[category].replace(/s$/, '')}
        </button>
      </div>
      {error && <div style={{ fontSize: 13, color: colors.danger, marginBottom: 14 }}>{error}</div>}

      <AdminTable columns={COLUMNS} empty={{ message: `No ${CATEGORY_LABELS[category].toLowerCase()} yet — add your first one.` }}>
        {products.map((p) => (
          <AdminTableRow key={p.id} columns={COLUMNS}>
            <PreviewTile previewUrl={p.previewUrl} hue={p.hue} alt={p.title} containerStyle={{ width: 36, height: 36, borderRadius: 8 }} />
            <div style={{ fontWeight: 700 }}>{p.title}</div>
            <div style={{ color: colors.textMuted2 }}>{p.style}</div>
            <div style={{ color: colors.textMuted2 }}>{p.files.length}</div>
            <div style={{ fontWeight: 700 }}>${formatUSD(p.priceCents)}</div>
            <div>
              <ProductStatusToggle productId={p.id} status={p.status} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => openEditProduct(p.id)}
                className="admin-btn"
                style={{ border: `1px solid ${colors.border}`, background: colors.surface, fontSize: 12, fontWeight: 700, padding: '6px 10px', borderRadius: 7, cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                className="admin-btn"
                style={{ border: `1px solid ${colors.dangerBorder}`, color: colors.danger, background: colors.surface, fontSize: 12, fontWeight: 700, padding: '6px 10px', borderRadius: 7, cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>

      {showModal && (
        <ProductModal
          title={editingId ? 'Edit product' : 'Add product'}
          draft={draft}
          onChange={setDraft}
          onCancel={closeModal}
          onSave={saveProduct}
          saving={saving}
        />
      )}
    </div>
  );
}
