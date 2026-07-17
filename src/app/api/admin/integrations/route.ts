import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { logAudit } from '@/lib/audit';

const PLATFORMS = ['google', 'bing', 'facebook', 'instagram', 'x', 'linkedin'] as const;

const updateInput = z.object({
  items: z.array(
    z.object({
      platform: z.enum(PLATFORMS),
      pixelId: z.string().trim(),
      isActive: z.boolean()
    })
  )
});

async function getOrSeedIntegrations() {
  let existing: any[] = [];
  try {
    existing = await prisma.$queryRaw<any[]>`SELECT * FROM "AdIntegration"`;
  } catch (err) {
    existing = [];
  }
  
  if (existing.length === PLATFORMS.length) {
    return existing;
  }

  // Pre-seed any missing platforms with defaults
  const missingPlatforms = PLATFORMS.filter(
    (p) => !existing.some((x: any) => x.platform === p)
  );

  if (missingPlatforms.length > 0) {
    for (const p of missingPlatforms) {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      await prisma.$executeRaw`
        INSERT INTO "AdIntegration" (id, platform, "pixelId", "isActive", "updatedAt")
        VALUES (${id}, ${p}, '', false, NOW())
      `;
    }
  }

  try {
    return await prisma.$queryRaw<any[]>`SELECT * FROM "AdIntegration"`;
  } catch (err) {
    return [];
  }
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const integrations = await getOrSeedIntegrations();
    return NextResponse.json(integrations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    const parsed = updateInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items } = parsed.data;

    // Run updates in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.$executeRaw`
          UPDATE "AdIntegration"
          SET "pixelId" = ${item.pixelId}, "isActive" = ${item.isActive}, "updatedAt" = NOW()
          WHERE platform = ${item.platform}
        `
      )
    );

    await logAudit((session.user as any).id, 'marketing.update_integrations', 'AdIntegration', 'bulk');

    let updated: any[] = [];
    try {
      updated = await prisma.$queryRaw<any[]>`SELECT * FROM "AdIntegration"`;
    } catch (err) {
      updated = [];
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
