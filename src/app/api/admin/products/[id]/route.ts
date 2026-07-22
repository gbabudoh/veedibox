import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { logAudit } from '@/lib/audit';

const fileInput = z.object({
  label: z.string().min(1),
  kind: z.enum(['DIGITAL', 'PRINT']).default('DIGITAL'),
  fileKey: z.string().min(1),
  fileSizeMb: z.number().int().nonnegative()
});

const productUpdateInput = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.enum(['WALL_ART', 'STOCK', 'TEMPLATES', 'BUNDLES']).optional(),
  style: z.string().min(1).optional(),
  price: z.number().int().nonnegative().optional(),
  previewKey: z.string().min(1).optional(),
  status: z.enum(['draft', 'published']).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.array(z.string())])).optional(),
  isAiGenerated: z.boolean().optional(),
  files: z.array(fileInput).min(1).optional()
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = productUpdateInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });

  const { files, ...rest } = parsed.data;

  // Files are only replaced when the request explicitly includes them, so other fields
  // (e.g. just flipping status) can be patched independently without resending the file list.
  if (files) {
    await prisma.$transaction([
      prisma.productFile.deleteMany({ where: { productId: params.id } }),
      prisma.product.update({
        where: { id: params.id },
        data: { ...rest, files: { create: files.map((f, i) => ({ ...f, sortOrder: i })) } }
      })
    ]);
  } else {
    await prisma.product.update({ where: { id: params.id }, data: rest });
  }

  const product = await prisma.product.findUniqueOrThrow({ where: { id: params.id }, include: { files: true } });

  await logAudit((session.user as any).id, 'product.update', 'Product', product.id, { title: product.title });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const product = await prisma.product.delete({ where: { id: params.id } });

  await logAudit((session.user as any).id, 'product.delete', 'Product', params.id, { title: product.title });

  return NextResponse.json({ ok: true });
}
