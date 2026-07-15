import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getDownloadUrl, BUCKETS } from '@/lib/storage/minio';

// Issues a short-lived, signed MinIO download URL for a valid, unexpired DownloadToken.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await prisma.downloadToken.findUnique({ where: { token: params.id }, include: { productFile: true } });
  if (!token || token.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Link expired or invalid' }, { status: 410 });
  }

  const url = await getDownloadUrl(BUCKETS.originals, token.productFile.fileKey);
  await prisma.downloadToken.update({ where: { id: token.id }, data: { usedCount: { increment: 1 } } });
  return NextResponse.redirect(url);
}
