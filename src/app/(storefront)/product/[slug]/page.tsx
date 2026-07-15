import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LicenseSelector } from '@/components/product/LicenseSelector';
import { ProductGallery } from '@/components/product/ProductGallery';
import { prisma } from '@/lib/db/client';
import { toUIProduct, CATEGORY_LABELS } from '@/lib/product-mapper';
import { withPreviewUrl } from '@/lib/product-preview';
import { colors, fonts, maxWidth } from '@/lib/theme';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const row = await prisma.product.findUnique({ where: { slug: params.slug }, include: { files: true } });
  if (!row || row.status !== 'published') notFound();

  const product = withPreviewUrl(toUIProduct(row));

  return (
    <div style={{ maxWidth: maxWidth.page, margin: '0 auto', padding: '32px 32px 96px', animation: 'fadeIn 0.35s ease' }}>
      <div style={{ fontSize: 13, color: colors.textMuted2, marginBottom: 20 }}>
        <Link href="/">Home</Link> / <Link href={`/shop/${product.category}`}>{CATEGORY_LABELS[product.category]}</Link> / {product.title}
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
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'oklch(42% 0.02 265)', margin: '0 0 24px' }}>{product.description}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 10,
              fontSize: 12.5,
              color: colors.textMuted,
              borderTop: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
              padding: '16px 0',
              marginBottom: 24
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: colors.text }}>Formats</div>
              {product.formats}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: colors.text }}>Dimensions</div>
              {product.dimensions}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: colors.text }}>File size</div>
              {product.fileSizeMb} MB
            </div>
          </div>
          <LicenseSelector product={product} />
        </div>
      </div>
    </div>
  );
}
