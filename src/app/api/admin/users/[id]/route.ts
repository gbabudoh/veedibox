import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { logAudit } from '@/lib/audit';

const updateInput = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
  role: z.enum(['CUSTOMER', 'ADMIN', 'SUPER_ADMIN', 'CREATOR']).optional()
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const actorId = (session.user as any).id;
  const actorRole = (session.user as any).role;

  const body = await req.json().catch(() => null);
  const parsed = updateInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  if (parsed.data.role !== undefined && actorRole !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only a Super Admin can change roles' }, { status: 403 });
  }

  if (params.id === actorId && (parsed.data.status !== undefined || parsed.data.role !== undefined)) {
    return NextResponse.json({ error: "You can't change your own status or role" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id: params.id }, data: parsed.data });

  if (parsed.data.status !== undefined) {
    await logAudit(actorId, parsed.data.status === 'SUSPENDED' ? 'user.suspend' : 'user.reactivate', 'User', user.id, { email: user.email });
  }
  if (parsed.data.role !== undefined) {
    await logAudit(actorId, 'user.role_change', 'User', user.id, { email: user.email, newRole: parsed.data.role });
  }

  return NextResponse.json({ id: user.id, status: user.status, role: user.role });
}
