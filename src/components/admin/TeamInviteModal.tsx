'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { colors, fonts, radii, shadows } from '@/lib/theme';

export function TeamInviteModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Could not create admin account.');
      return;
    }
    onClose();
    router.refresh();
  };

  const canSave = name.trim().length > 0 && email.includes('@') && password.length >= 8 && !saving;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(16,20,30,0.45)', zIndex: 300, animation: 'fadeIn 0.15s ease' }} />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 440,
          maxWidth: '92vw',
          background: colors.surface,
          borderRadius: 20,
          zIndex: 301,
          padding: 28,
          boxShadow: shadows.modal,
          animation: 'modalIn 0.18s ease'
        }}
      >
        <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 19, marginBottom: 20, letterSpacing: -0.3 }}>Invite admin</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Email</div>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Initial password</div>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Role</div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'SUPER_ADMIN')}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: radii.md, border: `1px solid ${colors.borderStrong}`, fontSize: 14 }}
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          {error && <div style={{ fontSize: 13, color: colors.danger }}>{error}</div>}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            className="admin-btn"
            style={{ flex: 1, border: `1px solid ${colors.borderStrong}`, background: colors.surface, fontWeight: 700, fontSize: 14, padding: 13, borderRadius: radii.md, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSave}
            className="admin-btn"
            style={{
              flex: 1,
              border: 'none',
              background: colors.primaryGradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              padding: 13,
              borderRadius: radii.md,
              cursor: canSave ? 'pointer' : 'not-allowed',
              opacity: canSave ? 1 : 0.5,
              boxShadow: canSave ? '0 4px 12px oklch(58% 0.16 265 / 0.22)' : 'none'
            }}
          >
            {saving ? 'Creating…' : 'Create admin'}
          </button>
        </div>
      </div>
    </>
  );
}
