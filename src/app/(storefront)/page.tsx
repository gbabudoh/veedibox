import { CSSProperties } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { prisma } from '@/lib/db/client';
import { toUIProduct, CATEGORY_TO_URL, CATEGORY_LABELS, UrlCategory } from '@/lib/product-mapper';
import { withPreviewUrls, resolvePreviewUrl } from '@/lib/product-preview';
import { getHomepageContent, HeroTile } from '@/lib/homepage';
import { bgFor, colors, fonts, maxWidth } from '@/lib/theme';

const COLLECTION_HUES: Record<UrlCategory, number> = {
  'wall-art': 32,
  stock: 24,
  templates: 282,
  bundles: 12
};

// Renders a real uploaded image when the admin has set one for this hero tile,
// falling back to the original gradient placeholder otherwise.
function HeroTileImage({ tile, style }: { tile: HeroTile; style: CSSProperties }) {
  const previewUrl = tile.imageKey ? resolvePreviewUrl(tile.imageKey, { width: 640 }) : null;
  if (previewUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={previewUrl} alt="" style={{ ...style, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
  }
  return <div style={{ ...bgFor(tile.hue), ...style }} />;
}

export default async function HomePage() {
  const [trendingRows, categoryCounts, hero] = await Promise.all([
    prisma.product.findMany({ where: { status: 'published' }, include: { files: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.product.groupBy({ by: ['category'], where: { status: 'published' }, _count: { _all: true } }),
    getHomepageContent()
  ]);

  const trending = withPreviewUrls(trendingRows.map(toUIProduct));
  const collections = categoryCounts.map((c) => ({
    category: CATEGORY_TO_URL[c.category],
    title: CATEGORY_LABELS[CATEGORY_TO_URL[c.category]],
    count: c._count._all,
    hue: COLLECTION_HUES[CATEGORY_TO_URL[c.category]]
  }));

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <div
        style={{
          maxWidth: maxWidth.page,
          margin: '0 auto',
          padding: '72px 32px 64px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 56,
          alignItems: 'center'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: colors.primary,
              background: colors.primarySoft,
              padding: '6px 12px',
              borderRadius: 999,
              marginBottom: 20
            }}
          >
            {hero.badgeText}
          </div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 56, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, margin: '0 0 20px' }}>
            {hero.heading}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: colors.textMuted, maxWidth: 480, margin: '0 0 32px' }}>
            {hero.subheading}
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <Link
              href={hero.primaryButtonHref}
              style={{
                border: 'none',
                cursor: 'pointer',
                background: colors.primaryGradient,
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                padding: '15px 26px',
                borderRadius: 12,
                boxShadow: '0 10px 24px oklch(58% 0.16 265 / 0.28)',
                display: 'inline-block'
              }}
            >
              {hero.primaryButtonText}
            </Link>
            <Link
              href={hero.secondaryButtonHref}
              style={{
                border: `1px solid ${colors.borderStrong}`,
                background: colors.surface,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 15,
                padding: '15px 26px',
                borderRadius: 12,
                display: 'inline-block'
              }}
            >
              {hero.secondaryButtonText}
            </Link>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, height: 420 }}>
          <HeroTileImage tile={hero.heroTiles[0]} style={{ borderRadius: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <HeroTileImage tile={hero.heroTiles[1]} style={{ flex: 1, borderRadius: 16 }} />
            <HeroTileImage tile={hero.heroTiles[2]} style={{ flex: 1, borderRadius: 16 }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: maxWidth.page, margin: '0 auto', padding: '0 32px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>
            Featured collections
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {collections.map((c) => (
            <Link
              key={c.category}
              href={`/shop/${c.category}`}
              style={{ cursor: 'pointer', borderRadius: 16, overflow: 'hidden', border: `1px solid ${colors.border}`, background: colors.surface, display: 'block' }}
            >
              <div style={{ ...bgFor(c.hue), height: 150 }} />
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: colors.textMuted2 }}>{c.count} items</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ background: colors.dark, color: '#fff', padding: '56px 32px', margin: '0 0 72px' }}>
        <div style={{ maxWidth: maxWidth.page, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.tealAccent, marginBottom: 14 }}>
              Stock with soul
            </div>
            <div style={{ fontFamily: fonts.heading, fontSize: 30, fontWeight: 800, lineHeight: 1.25, letterSpacing: -0.5 }}>
              Stand out from generic competitors by using visuals that feel unique and memorable.
            </div>
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'oklch(80% 0.01 265)', margin: 0 }}>
            Curated photo packs, illustration sets, and textures made for founders and creators who want their brand to
            look distinct from day one.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: maxWidth.page, margin: '0 auto', padding: '0 32px 96px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>Trending now</h2>
          <Link href="/shop/all" style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14, color: colors.primary }}>
            View all →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
