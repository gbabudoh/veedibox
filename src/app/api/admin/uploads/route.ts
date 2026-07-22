import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { minioClient, BUCKETS } from '@/lib/storage/minio';
import { isRateLimited } from '@/lib/rate-limit';

function slugifyFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Proxies file uploads through our server to MinIO (avoids needing browser-to-MinIO CORS config).
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (isRateLimited(`uploads:${(session.user as any).id}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many uploads. Slow down and try again shortly.' }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });

  const file = form.get('file');
  const kind = form.get('kind');
  if (!(file instanceof File) || (kind !== 'preview' && kind !== 'original')) {
    return NextResponse.json({ error: 'Missing file or kind' }, { status: 400 });
  }

  const bucket = kind === 'preview' ? BUCKETS.previews : BUCKETS.originals;
  const objectKey = `${crypto.randomUUID()}-${slugifyFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await minioClient.putObject(bucket, objectKey, buffer, buffer.length, { 'Content-Type': file.type || 'application/octet-stream' });

  return NextResponse.json({ objectKey, bucket }, { status: 201 });
}
