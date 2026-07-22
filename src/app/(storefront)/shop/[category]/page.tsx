import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { prisma } from '@/lib/db/client';
import { toUIProduct, CATEGORY_TO_DB, CATEGORY_LABELS, UrlCategory } from '@/lib/product-mapper';
import { CATEGORY_METADATA_FIELDS } from '@/lib/category-fields';
import { withPreviewUrls } from '@/lib/product-preview';
import { colors, fonts, maxWidth, radii } from '@/lib/theme';

const ORIENTATION_OPTIONS = CATEGORY_METADATA_FIELDS['wall-art'].find((f) => f.key === 'orientation')?.options ?? [];

const CATEGORY_KEYS: (UrlCategory | 'all')[] = ['all', 'wall-art', 'stock', 'templates', 'bundles'];

const CATEGORY_DESCRIPTIONS: Record<UrlCategory | 'all', string> = {
  all: 'Browse all creative assets, print layouts, stock bundles, and custom mockups.',
  'wall-art': 'High-resolution posters, canvases, and gallery prints optimized for home or office wall decoration.',
  stock: 'Premium photos, illustrations, and textures built to give your brand character.',
  templates: 'Modern presentation decks, vector wireframes, and layouts to accelerate your design workflows.',
  bundles: 'Curated creative assets and designer packs bundled together at discounted pricing.'
};

const USE_CASES = [
  { id: 'decor', label: 'Home & office decor', keywords: ['decor', 'home', 'office', 'studio', 'interior', 'living room'] },
  { id: 'branding', label: 'Web & social branding', keywords: ['branding', 'social', 'logo', 'landing page', 'pitch deck', 'saas', 'business', 'instagram', 'linkedin', 'canva'] },
  { id: 'print', label: 'Print & merch', keywords: ['print', 'paper', 'canvas', 'merch', 'poster', 'ready pdf'] }
];

// Sidebar visual SVGs
function CategoryGridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function WallArtIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
    </svg>
  );
}

function StockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function TemplatesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function BundlesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<UrlCategory | 'all', React.ReactNode> = {
  all: <CategoryGridIcon />,
  'wall-art': <WallArtIcon />,
  stock: <StockIcon />,
  templates: <TemplatesIcon />,
  bundles: <BundlesIcon />
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function buildStyleHref(category: string, currentStyles: string[], selectedUseCases: string[], selectedOrientations: string[], style: string, search?: string) {
  const next = currentStyles.includes(style) ? currentStyles.filter((s) => s !== style) : [...currentStyles, style];
  const params = new URLSearchParams();
  next.forEach((s) => params.append('style', s));
  selectedUseCases.forEach((u) => params.append('usecase', u));
  selectedOrientations.forEach((o) => params.append('orientation', o));
  if (search) {
    params.set('search', search);
  }
  const qs = params.toString();
  return `/shop/${category}${qs ? `?${qs}` : ''}`;
}

function buildUseCaseHref(category: string, currentStyles: string[], selectedUseCases: string[], selectedOrientations: string[], usecase: string, search?: string) {
  const next = selectedUseCases.includes(usecase) ? selectedUseCases.filter((u) => u !== usecase) : [...selectedUseCases, usecase];
  const params = new URLSearchParams();
  currentStyles.forEach((s) => params.append('style', s));
  next.forEach((u) => params.append('usecase', u));
  selectedOrientations.forEach((o) => params.append('orientation', o));
  if (search) {
    params.set('search', search);
  }
  const qs = params.toString();
  return `/shop/${category}${qs ? `?${qs}` : ''}`;
}

function buildOrientationHref(category: string, currentStyles: string[], selectedUseCases: string[], selectedOrientations: string[], orientation: string, search?: string) {
  const next = selectedOrientations.includes(orientation) ? selectedOrientations.filter((o) => o !== orientation) : [...selectedOrientations, orientation];
  const params = new URLSearchParams();
  currentStyles.forEach((s) => params.append('style', s));
  selectedUseCases.forEach((u) => params.append('usecase', u));
  next.forEach((o) => params.append('orientation', o));
  if (search) {
    params.set('search', search);
  }
  const qs = params.toString();
  return `/shop/${category}${qs ? `?${qs}` : ''}`;
}

function buildClearAllHref(category: string) {
  return `/shop/${category}`;
}

function buildCategoryHref(key: string, search?: string, selectedUseCases: string[] = []) {
  const params = new URLSearchParams();
  if (search) {
    params.set('search', search);
  }
  selectedUseCases.forEach((u) => params.append('usecase', u));
  const qs = params.toString();
  return `/shop/${key}${qs ? `?${qs}` : ''}`;
}

export default async function ShopCategoryPage({
  params,
  searchParams
}: {
  params: { category: string };
  searchParams: { style?: string | string[]; search?: string; usecase?: string | string[]; orientation?: string | string[] };
}) {
  const category = params.category as UrlCategory | 'all';
  if (!CATEGORY_KEYS.includes(category)) notFound();

  const selectedStyles = toArray(searchParams.style);
  const selectedUseCases = toArray(searchParams.usecase);
  const selectedOrientations = category === 'wall-art' ? toArray(searchParams.orientation) : [];
  const search = typeof searchParams.search === 'string' ? searchParams.search.trim() : undefined;

  // Build compound filter constraints for Prisma
  const andFilters = [];
  if (category !== 'all') {
    andFilters.push({ category: CATEGORY_TO_DB[category] });
  }
  if (selectedStyles.length > 0) {
    andFilters.push({ style: { in: selectedStyles } });
  }
  if (selectedOrientations.length > 0) {
    andFilters.push({ OR: selectedOrientations.map((o) => ({ metadata: { path: ['orientation'], equals: o } })) });
  }
  if (selectedUseCases.length > 0) {
    const useCaseFilters = selectedUseCases.flatMap((ucId) => {
      const uc = USE_CASES.find((u) => u.id === ucId);
      if (!uc) return [];
      return uc.keywords.flatMap((kw) => [
        { description: { contains: kw, mode: 'insensitive' } },
        { title: { contains: kw, mode: 'insensitive' } },
        { tags: { has: kw } }
      ]);
    });
    andFilters.push({ OR: useCaseFilters });
  }
  if (search) {
    andFilters.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { style: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    });
  }

  const [productRows, allStyleRows] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: 'published',
        AND: andFilters as any
      },
      include: { files: true },
      orderBy: { createdAt: 'desc' }
    }),
    // Unfiltered so the style sidebar doesn't shrink as filters get applied.
    prisma.product.findMany({ where: { status: 'published' }, distinct: ['style'], select: { style: true } })
  ]);

  const filteredProducts = withPreviewUrls(productRows.map(toUIProduct));
  const allStyles = allStyleRows.map((r) => r.style);

  const catStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    border: 'none',
    background: active ? colors.primarySoft : 'transparent',
    color: active ? colors.primary : 'oklch(38% 0.02 265)',
    fontWeight: 700,
    fontSize: 13.5,
    padding: '10px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  });

  const styleChipStyle = (active: boolean): React.CSSProperties => ({
    border: `1px solid ${active ? colors.primary : colors.border}`,
    background: active ? colors.primarySoft : colors.surface,
    color: active ? colors.primary : colors.textMuted,
    fontWeight: 600,
    fontSize: 12.5,
    padding: '7px 12px',
    borderRadius: 999,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.15s ease'
  });

  const useCaseLinkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: active ? colors.primary : colors.textMuted,
    fontWeight: active ? 700 : 500,
    fontSize: 13.5,
    cursor: 'pointer',
    transition: 'color 0.15s ease',
    padding: '4px 0'
  });

  return (
    <div style={{ maxWidth: maxWidth.page, margin: '0 auto', padding: '40px 32px 96px', display: 'grid', gridTemplateColumns: '270px 1fr', gap: 40, animation: 'fadeIn 0.35s ease' }}>
      <div>
        <div style={{ fontWeight: 800, fontFamily: fonts.heading, fontSize: 14, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted }}>Category</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 32 }}>
          {CATEGORY_KEYS.map((key) => (
            <Link key={key} href={buildCategoryHref(key, search, selectedUseCases)} style={catStyle(category === key)}>
              {CATEGORY_ICONS[key]}
              {CATEGORY_LABELS[key]}
            </Link>
          ))}
        </div>

        <div style={{ fontWeight: 800, fontFamily: fonts.heading, fontSize: 14, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted }}>Style</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {allStyles.map((s) => (
            <Link key={s} href={buildStyleHref(category, selectedStyles, selectedUseCases, selectedOrientations, s, search)} style={styleChipStyle(selectedStyles.includes(s))}>
              {s}
              {selectedStyles.includes(s) && <span style={{ fontWeight: 800, fontSize: 13, color: colors.primary }}>×</span>}
            </Link>
          ))}
        </div>

        {category === 'wall-art' && (
          <>
            <div style={{ fontWeight: 800, fontFamily: fonts.heading, fontSize: 14, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted }}>Orientation</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {ORIENTATION_OPTIONS.map((o) => (
                <Link key={o} href={buildOrientationHref(category, selectedStyles, selectedUseCases, selectedOrientations, o, search)} style={styleChipStyle(selectedOrientations.includes(o))}>
                  {o}
                  {selectedOrientations.includes(o) && <span style={{ fontWeight: 800, fontSize: 13, color: colors.primary }}>×</span>}
                </Link>
              ))}
            </div>
          </>
        )}

        <div style={{ fontWeight: 800, fontFamily: fonts.heading, fontSize: 14, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted }}>Use case</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {USE_CASES.map((uc) => {
            const active = selectedUseCases.includes(uc.id);
            return (
              <Link key={uc.id} href={buildUseCaseHref(category, selectedStyles, selectedUseCases, selectedOrientations, uc.id, search)} style={useCaseLinkStyle(active)}>
                <span style={{
                  width: 16,
                  height: 16,
                  borderRadius: 5,
                  border: `1.5px solid ${active ? colors.primary : colors.borderStrong}`,
                  background: active ? colors.primary : 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 800
                }}>
                  {active && '✓'}
                </span>
                {uc.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 4px' }}>
              {CATEGORY_LABELS[category]}
            </h1>
            <p style={{ fontSize: 13.5, color: colors.textMuted, margin: 0 }}>
              {CATEGORY_DESCRIPTIONS[category]}
            </p>
          </div>
          <div style={{ fontSize: 13.5, color: colors.textMuted2, fontWeight: 600 }}>{filteredProducts.length} results</div>
        </div>

        {(search || selectedStyles.length > 0 || selectedUseCases.length > 0 || selectedOrientations.length > 0) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: colors.primarySofter,
              border: `1px solid ${colors.primarySoft}`,
              borderRadius: 12,
              padding: '12px 18px',
              marginBottom: 24,
              fontSize: 13.5
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <span style={{ color: colors.textMuted, fontWeight: 600 }}>Filters active:</span>
              {search && (
                <span style={{ background: '#fff', padding: '4px 10px', borderRadius: 6, border: `1px solid ${colors.border}` }}>
                  Search: <strong style={{ color: colors.primary }}>&ldquo;{search}&rdquo;</strong>
                </span>
              )}
              {selectedStyles.length > 0 && (
                <span style={{ background: '#fff', padding: '4px 10px', borderRadius: 6, border: `1px solid ${colors.border}` }}>
                  Styles: <strong style={{ color: colors.primary }}>{selectedStyles.join(', ')}</strong>
                </span>
              )}
              {selectedUseCases.length > 0 && (
                <span style={{ background: '#fff', padding: '4px 10px', borderRadius: 6, border: `1px solid ${colors.border}` }}>
                  Use cases: <strong style={{ color: colors.primary }}>{selectedUseCases.map(id => USE_CASES.find(u => u.id === id)?.label).join(', ')}</strong>
                </span>
              )}
              {selectedOrientations.length > 0 && (
                <span style={{ background: '#fff', padding: '4px 10px', borderRadius: 6, border: `1px solid ${colors.border}` }}>
                  Orientation: <strong style={{ color: colors.primary }}>{selectedOrientations.join(', ')}</strong>
                </span>
              )}
            </div>
            <Link
              href={buildClearAllHref(category)}
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: colors.primary,
                padding: '4px 8px',
                borderRadius: 6,
                background: colors.primarySoft,
                whiteSpace: 'nowrap'
              }}
            >
              Clear all ×
            </Link>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div>
            {(search || selectedStyles.length > 0 || selectedUseCases.length > 0) ? (
              <div
                style={{
                  padding: '80px 24px',
                  textAlign: 'center',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.xl,
                  marginTop: 20
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'oklch(96% 0.008 85)',
                    color: colors.textMuted2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: fonts.heading, fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
                  No matches found
                </h3>
                <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.5 }}>
                  We couldn&apos;t find any assets matching your current filter set. Try adjusting or clearing your filters.
                </p>
                <Link
                  href={buildClearAllHref(category)}
                  style={{
                    background: colors.dark,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '10px 18px',
                    borderRadius: radii.md,
                    display: 'inline-block'
                  }}
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div style={{ padding: '60px 0', textAlign: 'center', color: colors.textFaint, fontSize: 14 }}>
                No items match these filters yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
