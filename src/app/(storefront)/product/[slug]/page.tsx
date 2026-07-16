import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LicenseSelector } from '@/components/product/LicenseSelector';
import { ProductGallery } from '@/components/product/ProductGallery';
import { prisma } from '@/lib/db/client';
import { toUIProduct, CATEGORY_LABELS } from '@/lib/product-mapper';
import { withPreviewUrl } from '@/lib/product-preview';
import { colors, fonts, maxWidth } from '@/lib/theme';

function FormatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function DimensionsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

function SizeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const row = await prisma.product.findUnique({ where: { slug: params.slug }, include: { files: true } });
  if (!row || row.status !== 'published') notFound();

  const product = withPreviewUrl(toUIProduct(row));

  const metaCardStyle: React.CSSProperties = {
    background: colors.primarySofter,
    border: `1px solid ${colors.primarySoft}`,
    borderRadius: 12,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  };

  const metaLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontWeight: 700,
    color: colors.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  };

  return (
    <div style={{ maxWidth: maxWidth.page, margin: '0 auto', padding: '32px 32px 96px', animation: 'fadeIn 0.35s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: colors.textMuted2 }}>
          <Link href="/">Home</Link> / <Link href={`/shop/${product.category}`}>{CATEGORY_LABELS[product.category]}</Link> / {product.title}
        </div>
        <Link
          href={`/shop/${product.category}`}
          className="back-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: `1px solid ${colors.border}`,
            background: colors.surface,
            fontSize: 13,
            fontWeight: 700,
            padding: '8px 14px',
            borderRadius: 999,
            color: colors.textMuted
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to {CATEGORY_LABELS[product.category]}
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56 }}>
        <div>
          <ProductGallery previewUrl={product.previewUrl} baseHue={product.hue} title={product.title} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
            {product.style}
          </div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 14px' }}>{product.title}</h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'oklch(42% 0.02 265)', margin: '0 0 24px' }}>{product.description}</p>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 12,
              marginBottom: 32
            }}
          >
            <div style={metaCardStyle}>
              <div style={metaLabelStyle}>
                <FormatIcon />
                Formats
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: colors.text }}>{product.formats}</div>
            </div>

            <div style={metaCardStyle}>
              <div style={metaLabelStyle}>
                <DimensionsIcon />
                Dimensions
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: colors.text }}>{product.dimensions}</div>
            </div>

            <div style={metaCardStyle}>
              <div style={metaLabelStyle}>
                <SizeIcon />
                File size
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: colors.text }}>{product.fileSizeMb} MB</div>
            </div>
          </div>

          <LicenseSelector product={product} />
        </div>
      </div>
    </div>
  );
}
