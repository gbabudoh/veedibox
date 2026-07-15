'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { colors, fonts, radii, shadows } from '@/lib/theme';

export function AdminLoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setSubmitting(false);
    if (res?.error) {
      setError('Incorrect email or password.');
      return;
    }
    router.push(callbackUrl || '/admin');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.appBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32
      }}
    >
      <div
        style={{
          width: 400,
          maxWidth: '100%',
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.xxl,
          padding: 36,
          boxShadow: shadows.card,
          animation: 'fadeIn 0.35s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28 }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: colors.heroGradient, display: 'inline-block' }} />
          <span style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 19, color: colors.text }}>Veedibox</span>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: colors.primary,
              background: colors.primarySoft,
              padding: '3px 8px',
              borderRadius: 999,
              letterSpacing: 0.3
            }}
          >
            ADMIN
          </span>
        </div>

        <h1 style={{ fontFamily: fonts.heading, fontSize: 22, fontWeight: 800, letterSpacing: -0.4, color: colors.text, margin: '0 0 6px' }}>
          Admin sign in
        </h1>
        <p style={{ fontSize: 13.5, color: colors.textMuted, margin: '0 0 26px' }}>Restricted access — staff and administrators only.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: colors.text }}>Email</div>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@veedibox.com" />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: colors.text }}>Password</div>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div style={{ fontSize: 13, color: colors.danger }}>{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="admin-btn"
            style={{
              width: '100%',
              border: 'none',
              background: colors.primaryGradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14.5,
              padding: '13px 20px',
              borderRadius: radii.md,
              marginTop: 8,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              boxShadow: shadows.primaryGlow
            }}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
