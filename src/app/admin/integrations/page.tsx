import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { prisma } from '@/lib/db/client';
import { IntegrationsClient } from '@/components/admin/IntegrationsClient';

const PLATFORMS = ['google', 'bing', 'facebook', 'instagram', 'x', 'linkedin'] as const;

async function getIntegrationsData() {
  let existing: any[] = [];
  try {
    existing = await prisma.$queryRaw<any[]>`SELECT * FROM "AdIntegration"`;
  } catch (error) {
    existing = [];
  }

  if (existing.length < PLATFORMS.length) {
    // If not seeded yet, seed them first
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
      try {
        existing = await prisma.$queryRaw<any[]>`SELECT * FROM "AdIntegration"`;
      } catch (error) {
        existing = [];
      }
    }
  }

  // Convert schema properties to clean arrays to render client side
  return existing.map((x: any) => ({
    id: x.id,
    platform: x.platform,
    pixelId: x.pixelId,
    isActive: x.isActive
  }));
}

export default async function AdminIntegrationsPage() {
  const session = await requireAdmin();
  if (!session) redirect('/admin-login');

  const integrations = await getIntegrationsData();

  return <IntegrationsClient initialData={integrations} />;
}
