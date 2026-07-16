import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { logAudit } from '@/lib/audit';
import { getHomepageContent, HERO_TILE_COUNT } from '@/lib/homepage';

const heroTileInput = z.object({
  imageKey: z.string().min(1).nullable(),
  hue: z.number().int().min(0).max(360)
});

const homepageInput = z.object({
  badgeText: z.string().min(1),
  heading: z.string().min(1),
  subheading: z.string().min(1),
  primaryButtonText: z.string().min(1),
  primaryButtonHref: z.string().min(1),
  secondaryButtonText: z.string().min(1),
  secondaryButtonHref: z.string().min(1),
  heroTiles: z.array(heroTileInput).length(HERO_TILE_COUNT)
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const content = await getHomepageContent();
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = homepageInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  await prisma.homepageContent.upsert({
    where: { id: 'homepage' },
    create: { id: 'homepage', ...data },
    update: data
  });

  await logAudit((session.user as any).id, 'homepage.update', 'HomepageContent', 'homepage');

  const content = await getHomepageContent();
  return NextResponse.json(content);
}
