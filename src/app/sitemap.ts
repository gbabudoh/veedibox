import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://veedibox.com';

  // Static routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/shop/all`, lastModified: new Date() },
    { url: `${baseUrl}/shop/wall-art`, lastModified: new Date() },
    { url: `${baseUrl}/shop/stock`, lastModified: new Date() },
    { url: `${baseUrl}/shop/templates`, lastModified: new Date() },
    { url: `${baseUrl}/shop/bundles`, lastModified: new Date() },
  ];

  // Dynamic product routes
  try {
    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true }
    });

    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
