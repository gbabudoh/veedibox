import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { logAudit } from '@/lib/audit';
import { getAboutContent } from '@/lib/about';

const aboutInput = z.object({
  badgeText: z.string().min(1),
  heading: z.string().min(1),
  paragraph1: z.string().min(1),
  paragraph2: z.string().min(1),
  storyVisualHue: z.number().int().min(0).max(360),
  storyVisualTitle: z.string().min(1),
  storyVisualSubtitle: z.string().min(1),
  pillar1Title: z.string().min(1),
  pillar1Desc: z.string().min(1),
  pillar2Title: z.string().min(1),
  pillar2Desc: z.string().min(1),
  pillar3Title: z.string().min(1),
  pillar3Desc: z.string().min(1),
  ctaHeading: z.string().min(1),
  ctaSubheading: z.string().min(1),
  ctaButtonText: z.string().min(1),
  ctaButtonHref: z.string().min(1)
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const content = await getAboutContent();
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = aboutInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  await (prisma as any).aboutPageContent.upsert({
    where: { id: 'about' },
    create: { id: 'about', ...data },
    update: data
  });

  await logAudit((session.user as any).id, 'about.update', 'AboutPageContent', 'about');

  const content = await getAboutContent();
  return NextResponse.json(content);
}
