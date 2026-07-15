import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { prisma } from '@/lib/db/client';
import { toUIProduct, CATEGORY_TO_DB, CATEGORY_LABELS, UrlCategory } from '@/lib/product-mapper';
import { withPreviewUrls } from '@/lib/product-preview';
import { colors, fonts, maxWidth } from '@/lib/theme';

const CATEGORY_KEYS: (UrlCategory | 'all')[] = ['all', 'wall-art', 'stock', 'templates', 'bundles'];

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function buildStyleHref(category: string, currentStyles: string[], style: string) {
  const next = currentStyles.includes(style) ? currentStyles.filter((s) => s !== style) : [...currentStyles, style];
  if (next.length === 0) return `/shop/${category}`;
  const qs = next.map((s) => `style=${encodeURIComponent(s)}`).join('&');
  return `/shop/${category}?${qs}`;
}

export default async function ShopCategoryPage({
  params,
  searchParams
}: {
  params: { category: string };
  searchParams: { style?: string | string[] };
}) {
  const category = params.category as UrlCategory | 'all';
  if (!CATEGORY_KEYS.includes(category)) notFound();

  const selectedStyles = toArray(searchParams.style);

  const [productRows, allStyleRows] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: 'published',
        ...(category !== 'all' && { category: CATEGORY_TO_DB[category] }),
        ...(selectedStyles.length > 0 && { style: { in: selectedStyles } })
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
    display: 'block',
    textAlign: 'left',
    border: 'none',
    background: active ? colors.primarySoft : 'transparent',
    color: active ? colors.primary : 'oklch(38% 0.02 265)',
    fontWeight: 700,
    fontSize: 13.5,
    padding: '9px 10px',
    borderRadius: 8,
    cursor: 'pointer'
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
    display: 'inline-block'
  });

  return (
    <div style={{ maxWidth: maxWidth.page, margin: '0 auto', padding: '40px 32px 96px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 36, animation: 'fadeIn 0.35s ease' }}>
      <div>
        <div style={{ fontWeight: 800, fontFamily: fonts.heading, fontSize: 14, marginBottom: 14 }}>Category</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 28 }}>
          {CATEGORY_KEYS.map((key) => (
            <Link key={key} href={`/shop/${key}`} style={catStyle(category === key)}>
              {CATEGORY_LABELS[key]}
            </Link>
          ))}
        </div>
        <div style={{ fontWeight: 800, fontFamily: fonts.heading, fontSize: 14, marginBottom: 14 }}>Style</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {allStyles.map((s) => (
            <Link key={s} href={buildStyleHref(category, selectedStyles, s)} style={styleChipStyle(selectedStyles.includes(s))}>
              {s}
            </Link>
          ))}
        </div>
        <div style={{ fontWeight: 800, fontFamily: fonts.heading, fontSize: 14, marginBottom: 14 }}>Use case</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, color: colors.textMuted }}>
          <div>Home &amp; office decor</div>
          <div>Web &amp; social branding</div>
          <div>Print &amp; merch</div>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>{CATEGORY_LABELS[category]}</h1>
          <div style={{ fontSize: 13.5, color: colors.textMuted2 }}>{filteredProducts.length} results</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center', color: colors.textFaint, fontSize: 14 }}>
            No items match these filters yet.
          </div>
        )}
      </div>
    </div>
  );
}
