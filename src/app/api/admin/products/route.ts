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

const productInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['WALL_ART', 'STOCK', 'TEMPLATES', 'BUNDLES']),
  style: z.string().min(1),
  price: z.number().int().nonnegative(),
  formats: z.string().min(1),
  dimensions: z.string().min(1),
  previewKey: z.string().min(1),
  status: z.enum(['draft', 'published']).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.union([z.string(), z.number()])).optional(),
  files: z.array(fileInput).min(1)
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uniqueSlug(base: string) {
  let slug = base || 'product';
  let n = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base || 'product'}-${n++}`;
  }
  return slug;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const products = await prisma.product.findMany({ include: { files: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = productInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });

  const { files, ...rest } = parsed.data;
  const slug = await uniqueSlug(slugify(rest.title));
  const product = await prisma.product.create({
    data: {
      ...rest,
      metadata: rest.metadata ?? undefined,
      slug,
      status: rest.status ?? 'published',
      tags: rest.tags ?? [],
      creatorId: (session.user as any).id,
      files: { create: files.map((f, i) => ({ ...f, sortOrder: i })) }
    },
    include: { files: true }
  });

  await logAudit((session.user as any).id, 'product.create', 'Product', product.id, { title: product.title, category: product.category });

  return NextResponse.json(product, { status: 201 });
}
