import crypto from 'crypto';

// Builds a signed imgproxy URL for on-the-fly resize/watermark from a MinIO-hosted source.
export function imgproxyUrl(sourceUrl: string, opts: { width?: number; height?: number; watermark?: boolean } = {}) {
  const { width = 800, height = 0, watermark = false } = opts;
  const encodedUrl = Buffer.from(sourceUrl).toString('base64url');
  const processingPath = `/resize:fit:${width}:${height}${watermark ? '/wm:0.2:soea:10:10' : ''}/${encodedUrl}`;

  const key = Buffer.from(process.env.IMGPROXY_KEY || '', 'hex');
  const salt = Buffer.from(process.env.IMGPROXY_SALT || '', 'hex');
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(Buffer.concat([salt, Buffer.from(processingPath)]));
  const signature = hmac.digest('base64url');

  const scheme = process.env.IMGPROXY_USE_SSL === 'true' ? 'https' : 'http';
  return `${scheme}://${process.env.IMGPROXY_HOST}/${signature}${processingPath}`;
}
