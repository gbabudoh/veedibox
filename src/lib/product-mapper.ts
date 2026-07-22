import type { Product, ProductFile, ProductCategory, LicenseType, OrderStatus, Role, FileKind } from '@prisma/client';

// Pure, isomorphic mapping/formatting utilities — safe to import from client components.
// Server-only preview URL resolution (imgproxy/minio, needs Node APIs + secret key) lives
// in src/lib/product-preview.ts instead, so client bundles never pull those in.

export type UrlCategory = 'wall-art' | 'stock' | 'templates' | 'bundles';
export type UiLicense = 'personal' | 'commercial' | 'extended';

export const CATEGORY_TO_DB: Record<UrlCategory, ProductCategory> = {
  'wall-art': 'WALL_ART',
  stock: 'STOCK',
  templates: 'TEMPLATES',
  bundles: 'BUNDLES'
};

export const CATEGORY_TO_URL: Record<ProductCategory, UrlCategory> = {
  WALL_ART: 'wall-art',
  STOCK: 'stock',
  TEMPLATES: 'templates',
  BUNDLES: 'bundles'
};

export const CATEGORY_LABELS: Record<UrlCategory | 'all', string> = {
  'wall-art': 'Wall Art',
  stock: 'Stock Images',
  templates: 'Templates',
  bundles: 'Bundles',
  all: 'All Products'
};

export const LICENSE_TO_DB: Record<UiLicense, LicenseType> = {
  personal: 'PERSONAL',
  commercial: 'COMMERCIAL',
  extended: 'EXTENDED'
};

export const LICENSE_TO_UI: Record<LicenseType, UiLicense> = {
  PERSONAL: 'personal',
  COMMERCIAL: 'commercial',
  EXTENDED: 'extended'
};

// 'extended' is kept only so the 1 historical order that used it still renders correctly in
// admin analytics and customer order history — it's no longer offered to new buyers.
// See SELECTABLE_LICENSES for what new-purchase UI should actually show.
export const LICENSE_MULT: Record<UiLicense, number> = { personal: 1, commercial: 2.5, extended: 5 };

export const LICENSE_META: Record<UiLicense, { label: string; desc: string }> = {
  personal: { label: 'For personal use', desc: 'Home & personal projects' },
  commercial: { label: 'For business use', desc: 'Branding, marketing, resale & commercial projects' },
  extended: { label: 'Extended use', desc: 'Resale & merch production' }
};

// The only tiers offered to new buyers (product page, licensing page). 'extended' stays out of
// this list but remains in LICENSE_META/LICENSE_MULT for historical order rendering.
export const SELECTABLE_LICENSES: UiLicense[] = ['personal', 'commercial'];

export const ORDER_STATUS_LABEL: Record<OrderStatus, 'Paid' | 'Refunded' | 'Pending'> = {
  PAID: 'Paid',
  REFUNDED: 'Refunded',
  PENDING: 'Pending'
};

export const ROLE_LABEL: Record<Role, 'Customer' | 'Admin' | 'Super Admin' | 'Creator'> = {
  CUSTOMER: 'Customer',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
  CREATOR: 'Creator'
};

export function formatUSD(cents: number): string {
  return String(Math.round(cents / 100));
}

// Deterministic gradient-placeholder hue for products with no real preview yet.
export function hueFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash % 360;
}

const SEED_KEY_PREFIX = 'seed/';

export function hasRealPreview(previewKey: string): boolean {
  return Boolean(previewKey) && !previewKey.startsWith(SEED_KEY_PREFIX);
}

export type ProductWithFiles = Product & { files: ProductFile[]; creator?: { name: string | null } | null };

const KNOWN_LABEL_EXTENSIONS = ['JPEG', 'JPG', 'PNG', 'PDF', 'ZIP', 'PSD', 'AI', 'EPUB', 'TIFF', 'MP4', 'SVG'];

// Formats badge is derived from what was actually uploaded, never admin-typed free text, so it
// can't go stale or lie. Real uploads keep their original extension in fileKey (see
// api/admin/uploads/route.ts). Seed/demo data uses placeholder keys with no real extension, so
// for those we fall back to scanning the file label for a known format keyword.
function deriveFormats(files: { fileKey: string; label: string }[]): string {
  const found = new Set<string>();
  for (const f of files) {
    const isSeedPlaceholder = f.fileKey.startsWith(SEED_KEY_PREFIX);
    if (!isSeedPlaceholder) {
      const ext = f.fileKey.split('.').pop();
      if (ext && ext.length <= 5 && ext !== f.fileKey) {
        found.add(ext.toUpperCase());
        continue;
      }
    }
    const upperLabel = f.label.toUpperCase();
    for (const known of KNOWN_LABEL_EXTENSIONS) {
      if (upperLabel.includes(known)) found.add(known);
    }
  }
  return [...found].join(', ');
}

// Safe subset of a file — no fileKey. Customer-facing pages pass this into client
// components (LicenseSelector etc.), and server->client props are serialized in full,
// so the real MinIO object key must never end up in this shape.
export interface UIProductFile {
  id: string;
  label: string;
  kind: FileKind;
  fileSizeMb: number;
}

export interface UIProduct {
  id: string;
  slug: string;
  title: string;
  category: UrlCategory;
  style: string;
  priceCents: number;
  description: string;
  formats: string; // derived from uploaded files, see deriveFormats()
  fileSizeMb: number; // computed: sum of files[].fileSizeMb
  previewKey: string;
  status: string;
  hue: number;
  metadata: Record<string, string | number | string[]> | null;
  isAiGenerated: boolean;
  // Only populated when the query includes { creator: true } — null otherwise (list/grid views
  // don't need it). See ProductWithFiles.
  creatorName: string | null;
  files: UIProductFile[];
  // Resolved server-side (see product-preview.ts); null until a page fills it in.
  previewUrl: string | null;
}

export function toUIProduct(product: ProductWithFiles): UIProduct {
  const files = product.files.map((f) => ({ id: f.id, label: f.label, kind: f.kind, fileSizeMb: f.fileSizeMb }));
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: CATEGORY_TO_URL[product.category],
    style: product.style,
    priceCents: product.price,
    description: product.description,
    formats: deriveFormats(product.files),
    fileSizeMb: files.reduce((sum, f) => sum + f.fileSizeMb, 0),
    previewKey: product.previewKey,
    status: product.status,
    hue: hueFromId(product.id),
    metadata: (product.metadata as Record<string, string | number | string[]> | null) ?? null,
    isAiGenerated: product.isAiGenerated,
    creatorName: product.creator?.name ?? null,
    files,
    previewUrl: null
  };
}

// Admin-only superset — includes real fileKeys so the catalog management UI can tell
// which file slots already have an upload. Never pass this into a customer-facing page.
export interface AdminProductFile extends UIProductFile {
  fileKey: string;
}

export interface AdminProduct extends Omit<UIProduct, 'files'> {
  files: AdminProductFile[];
}

export interface ProductBadge {
  label: string;
  value: string;
}

function metaString(metadata: Record<string, string | number | string[]> | null, key: string): string {
  const v = metadata?.[key];
  return typeof v === 'string' || typeof v === 'number' ? String(v) : '—';
}

// Badges shown on the product detail page, tailored to what's actually meaningful per category
// (defined once, alongside the matching admin input fields, in category-fields.ts).
export function getCategoryBadges(product: Pick<UIProduct, 'category' | 'metadata'>): ProductBadge[] {
  switch (product.category) {
    case 'wall-art':
      return [
        { label: 'Orientation', value: metaString(product.metadata, 'orientation') },
        { label: 'Print sizes', value: metaString(product.metadata, 'printSizes') }
      ];
    case 'stock':
      return [
        { label: 'Resolution', value: metaString(product.metadata, 'resolution') },
        { label: 'Image count', value: metaString(product.metadata, 'imageCount') }
      ];
    case 'templates':
      return [
        { label: 'Software required', value: metaString(product.metadata, 'software') },
        { label: 'Editable layers', value: metaString(product.metadata, 'editableLayers') }
      ];
    case 'bundles':
      return [];
  }
}

// Bundles show a real itemized checklist instead of a badge — see category-fields.ts.
export function getIncludedItems(product: Pick<UIProduct, 'metadata'>): string[] {
  const items = product.metadata?.includedItems;
  return Array.isArray(items) ? items.filter((s) => s.trim().length > 0) : [];
}

export function toAdminProduct(product: ProductWithFiles): AdminProduct {
  const base = toUIProduct(product);
  return {
    ...base,
    files: product.files.map((f) => ({ id: f.id, label: f.label, kind: f.kind, fileSizeMb: f.fileSizeMb, fileKey: f.fileKey }))
  };
}
