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

export const LICENSE_MULT: Record<UiLicense, number> = { personal: 1, commercial: 2.5, extended: 5 };

export const LICENSE_META: Record<UiLicense, { label: string; desc: string }> = {
  personal: { label: 'Personal use', desc: 'Home & personal decor only' },
  commercial: { label: 'Commercial use', desc: 'Branding, social, and web use' },
  extended: { label: 'Extended use', desc: 'Resale & merch production' }
};

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

export type ProductWithFiles = Product & { files: ProductFile[] };

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
  formats: string;
  dimensions: string;
  fileSizeMb: number; // computed: sum of files[].fileSizeMb
  previewKey: string;
  status: string;
  hue: number;
  metadata: Record<string, string | number> | null;
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
    formats: product.formats,
    dimensions: product.dimensions,
    fileSizeMb: files.reduce((sum, f) => sum + f.fileSizeMb, 0),
    previewKey: product.previewKey,
    status: product.status,
    hue: hueFromId(product.id),
    metadata: (product.metadata as Record<string, string | number> | null) ?? null,
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

export function toAdminProduct(product: ProductWithFiles): AdminProduct {
  const base = toUIProduct(product);
  return {
    ...base,
    files: product.files.map((f) => ({ id: f.id, label: f.label, kind: f.kind, fileSizeMb: f.fileSizeMb, fileKey: f.fileKey }))
  };
}
