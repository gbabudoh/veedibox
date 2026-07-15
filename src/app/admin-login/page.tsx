import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default async function AdminLoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    redirect(searchParams.callbackUrl || '/admin');
  }

  return <AdminLoginForm callbackUrl={searchParams.callbackUrl} />;
}
