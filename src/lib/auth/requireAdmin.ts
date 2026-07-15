import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!ADMIN_ROLES.includes((session?.user as any)?.role)) return null;
  return session;
}

export async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') return null;
  return session;
}

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session;
}
