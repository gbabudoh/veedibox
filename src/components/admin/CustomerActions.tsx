'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors, radii } from '@/lib/theme';

export function CustomerActions({ userId, status }: { userId: string; status: 'ACTIVE' | 'SUSPENDED' }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isActive = status === 'ACTIVE';

  const toggleStatus = async () => {
    if (!confirm(isActive ? 'Suspend this account? They will be unable to log in.' : 'Reactivate this account?')) return;
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: isActive ? 'SUSPENDED' : 'ACTIVE' })
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className="admin-btn"
      style={{
        border: `1px solid ${isActive ? colors.dangerBorder : colors.border}`,
        color: isActive ? colors.danger : colors.text,
        background: colors.surface,
        fontWeight: 700,
        fontSize: 12.5,
        padding: '8px 14px',
        borderRadius: radii.sm,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1
      }}
    >
      {loading ? 'Working…' : isActive ? 'Suspend account' : 'Reactivate account'}
    </button>
  );
}
