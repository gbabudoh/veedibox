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
    previewKey: '',
    metadata: {},
    isAiGenerated: false,
    files: []
  };
}

export function AdminProductsClient({ category, initialProducts }: { category: UrlCategory; initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
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
      previewKey: p.previewKey,
      metadata: p.metadata ?? {},
      isAiGenerated: p.isAiGenerated,
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
      previewKey: draft.previewKey,
      metadata: draft.metadata,
      isAiGenerated: draft.isAiGenerated,
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

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{CATEGORY_LABELS[category]}</h1>
          <div style={{ fontSize: 13, color: colors.textFaint, marginTop: 4 }}>
            {searchQuery
              ? `${filteredProducts.length} of ${products.length} found`
              : `${products.length} product${products.length === 1 ? '' : 's'}`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
            <span style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textMuted2,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '9px 12px 9px 34px',
                borderRadius: radii.md,
                border: `1px solid ${colors.borderStrong}`,
                background: colors.surface,
                fontSize: 13,
                outline: 'none',
                color: colors.text,
                transition: 'all 0.15s ease'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.textFaint,
                  cursor: 'pointer',
                  padding: '4px 6px'
                }}
              >
                &times;
              </button>
            )}
          </div>

          <button
            onClick={openAddProduct}
            className="admin-btn btn-interactive"
            style={{ border: 'none', background: colors.primaryGradient, color: '#fff', fontWeight: 700, fontSize: 13.5, padding: '10px 18px', borderRadius: radii.md, cursor: 'pointer', boxShadow: '0 4px 12px oklch(58% 0.16 265 / 0.22)', whiteSpace: 'nowrap' }}
          >
            + Add {CATEGORY_LABELS[category].replace(/s$/, '')}
          </button>
        </div>
      </div>
      {error && <div style={{ fontSize: 13, color: colors.danger, marginBottom: 14 }}>{error}</div>}

      <AdminTable columns={COLUMNS} empty={{ message: searchQuery ? 'No products match your search query.' : `No ${CATEGORY_LABELS[category].toLowerCase()} yet — add your first one.` }}>
        {filteredProducts.map((p) => (
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
                className="admin-btn btn-interactive"
                style={{ border: `1px solid ${colors.border}`, background: colors.surface, fontSize: 12, fontWeight: 700, padding: '6px 10px', borderRadius: 7, cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                className="admin-btn btn-interactive"
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
