'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors, radii } from '@/lib/theme';

export function TeamMemberActions({
  userId,
  role,
  status,
  isSelf
}: {
  userId: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  isSelf: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isSelf) {
    return <span style={{ fontSize: 12, color: colors.textFaint }}>You</span>;
  }

  const patch = async (data: Record<string, string>) => {
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setLoading(false);
    router.refresh();
  };

  const togglePromote = () => {
    const nextRole = role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN';
    if (!confirm(`Change this account to ${nextRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}?`)) return;
    patch({ role: nextRole });
  };

  const toggleStatus = () => {
    const nextStatus = status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!confirm(nextStatus === 'SUSPENDED' ? 'Deactivate this admin account?' : 'Reactivate this admin account?')) return;
    patch({ status: nextStatus });
  };

  const btnStyle = (danger = false) => ({
    border: `1px solid ${danger ? colors.dangerBorder : colors.border}`,
    color: danger ? colors.danger : colors.text,
    background: colors.surface,
    fontWeight: 700,
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: radii.sm,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1
  });

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={togglePromote} disabled={loading} className="admin-btn" style={btnStyle()}>
        {role === 'SUPER_ADMIN' ? 'Demote' : 'Promote'}
      </button>
      <button onClick={toggleStatus} disabled={loading} className="admin-btn" style={btnStyle(status === 'ACTIVE')}>
        {status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
      </button>
    </div>
  );
}
