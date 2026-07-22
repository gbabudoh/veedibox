// In-memory fixed-window rate limiter. Good enough for a single-process VPS deployment — it
// resets on restart and doesn't coordinate across multiple instances, so if this ever moves to a
// multi-instance/serverless deployment, swap this for a shared store (e.g. Redis) instead.
const hits = new Map<string, { count: number; resetAt: number }>();

// Bound memory growth from stale keys (e.g. one-off IPs) without needing a separate timer.
const MAX_ENTRIES = 5000;

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    if (hits.size >= MAX_ENTRIES) hits.clear();
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}
