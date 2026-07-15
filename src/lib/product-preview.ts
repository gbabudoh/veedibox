import { imgproxyUrl } from '@/lib/storage/imgproxy';
import { BUCKETS } from '@/lib/storage/minio';
import { hasRealPreview } from '@/lib/product-mapper';

// Server-only: signs imgproxy URLs with a secret key and pulls in the Node-only minio SDK.
// Never import this from a 'use client' component — call it in a Server Component / API route
// and pass the resulting plain string down as a prop instead.

// imgproxy is configured with IMGPROXY_USE_S3=true against the same MinIO instance,
// so the source it expects is an s3:// URL, not a public HTTP one.
export function resolvePreviewUrl(previewKey: string, opts?: { width?: number; height?: number; watermark?: boolean }): string | null {
  if (!hasRealPreview(previewKey)) return null;
  return imgproxyUrl(`s3://${BUCKETS.previews}/${previewKey}`, opts);
}

export function withPreviewUrl<T extends { previewKey: string }>(product: T): T & { previewUrl: string | null } {
  return { ...product, previewUrl: resolvePreviewUrl(product.previewKey) };
}

export function withPreviewUrls<T extends { previewKey: string }>(products: T[]): (T & { previewUrl: string | null })[] {
  return products.map((p) => ({ ...p, previewUrl: resolvePreviewUrl(p.previewKey) }));
}
