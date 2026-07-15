import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/client';
import { requireSuperAdmin } from '@/lib/auth/requireAdmin';
import { logAudit } from '@/lib/audit';

const inviteInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z.enum(['ADMIN', 'SUPER_ADMIN'])
});

export async function POST(req: NextRequest) {
  const session = await requireSuperAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = inviteInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const admin = await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash, role: parsed.data.role }
  });

  await logAudit((session.user as any).id, 'admin.create', 'User', admin.id, { email: admin.email, role: admin.role });

  return NextResponse.json({ id: admin.id }, { status: 201 });
}
