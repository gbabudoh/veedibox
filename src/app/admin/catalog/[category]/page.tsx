import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/client';
import { toAdminProduct, CATEGORY_TO_DB, UrlCategory } from '@/lib/product-mapper';
import { withPreviewUrls } from '@/lib/product-preview';
import { AdminProductsClient } from '@/components/admin/AdminProductsClient';

const CATEGORY_KEYS: UrlCategory[] = ['wall-art', 'stock', 'templates', 'bundles'];

export default async function AdminCatalogCategoryPage({ params }: { params: { category: string } }) {
  const category = params.category as UrlCategory;
  if (!CATEGORY_KEYS.includes(category)) notFound();

  const rows = await prisma.product.findMany({
    where: { category: CATEGORY_TO_DB[category] },
    include: { files: true },
    orderBy: { createdAt: 'desc' }
  });
  return <AdminProductsClient category={category} initialProducts={withPreviewUrls(rows.map(toAdminProduct))} />;
}
