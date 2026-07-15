import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/auth/requireAdmin';
import { prisma } from '@/lib/db/client';
import { TeamClient } from '@/components/admin/TeamClient';

export default async function AdminTeamPage() {
  const session = await requireSuperAdmin();
  if (!session) redirect('/admin/catalog/wall-art');

  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <TeamClient
      admins={admins.map((a) => ({ id: a.id, name: a.name, email: a.email, role: a.role as 'ADMIN' | 'SUPER_ADMIN', status: a.status, createdAt: a.createdAt.toISOString() }))}
      currentUserId={(session.user as any).id}
    />
  );
}
