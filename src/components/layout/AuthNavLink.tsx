'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { colors } from '@/lib/theme';

export function AuthNavLink() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  if (!session?.user) {
    return (
      <Link href="/login" style={{ fontWeight: 600, fontSize: 14, color: colors.textMuted, cursor: 'pointer', padding: '8px 4px' }}>
        Log in
      </Link>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Link href="/dashboard" style={{ fontWeight: 600, fontSize: 14, color: colors.textMuted, cursor: 'pointer', padding: '8px 4px' }}>
        My Veedibox
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        style={{ border: 'none', background: 'none', fontWeight: 600, fontSize: 14, color: colors.textMuted, cursor: 'pointer', padding: '8px 4px' }}
      >
        Log out
      </button>
    </div>
  );
}
