'use client';

import { signOut } from 'next-auth/react';
import { Avatar } from '@/components/ui/Avatar';
import { LogoutIcon } from '@/components/admin/icons';

export function AdminUserCard({ name, email }: { name?: string | null; email?: string | null }) {
  return (
    <div
      style={{
        margin: '0 12px',
        padding: '10px 10px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}
    >
      <Avatar name={name} email={email} size={32} style={{ fontSize: 12 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 12.5, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name || 'Admin'}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {email}
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/admin-login' })}
        title="Log out"
        style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 6, display: 'flex' }}
      >
        <LogoutIcon />
      </button>
    </div>
  );
}
