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
          boxShadow: '0 20px 48px rgba(16, 24, 40, 0.05), 0 4px 12px rgba(16, 24, 40, 0.02)',
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
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.textMuted2,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@veedibox.com"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: colors.text }}>Password</div>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.textMuted2,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: colors.danger,
              background: 'oklch(50% 0.18 25 / 0.08)',
              border: '1px solid oklch(85% 0.08 25 / 0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

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
