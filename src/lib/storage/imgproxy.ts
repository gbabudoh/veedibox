import crypto from 'crypto';

// Builds an imgproxy URL for on-the-fly resize/watermark from a MinIO-hosted source. Signs the
// URL only if IMGPROXY_KEY/IMGPROXY_SALT are configured — our VPS imgproxy instance runs in
// unsigned mode (no key/salt set on the server), which requires the literal "insecure" signature
// segment instead of a real HMAC; imgproxy would just ignore a real one anyway with no key set.
export function imgproxyUrl(sourceUrl: string, opts: { width?: number; height?: number; watermark?: boolean } = {}) {
  const { width = 800, height = 0, watermark = false } = opts;
  const encodedUrl = Buffer.from(sourceUrl).toString('base64url');
  const processingPath = `/resize:fit:${width}:${height}${watermark ? '/wm:0.2:soea:10:10' : ''}/${encodedUrl}`;

  const keyHex = process.env.IMGPROXY_KEY;
  const saltHex = process.env.IMGPROXY_SALT;
  let signature = 'insecure';
  if (keyHex && saltHex) {
    const hmac = crypto.createHmac('sha256', Buffer.from(keyHex, 'hex'));
    hmac.update(Buffer.concat([Buffer.from(saltHex, 'hex'), Buffer.from(processingPath)]));
    signature = hmac.digest('base64url');
  }

  const scheme = process.env.IMGPROXY_USE_SSL === 'true' ? 'https' : 'http';
  return `${scheme}://${process.env.IMGPROXY_HOST}/${signature}${processingPath}`;
}
