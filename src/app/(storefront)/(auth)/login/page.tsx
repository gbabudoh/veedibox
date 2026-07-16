'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, fonts } from '@/lib/theme';

export default function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
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
    router.push(searchParams.callbackUrl || '/dashboard');
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto 80px', padding: '0 24px', animation: 'fadeIn 0.35s ease' }}>
      <div style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        boxShadow: '0 20px 48px rgba(16, 24, 40, 0.05), 0 4px 12px rgba(16, 24, 40, 0.02)',
        padding: '40px 32px'
      }}>
        {/* Branding Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
          <img
            src="/favicon.png"
            alt="Veedibox logo"
            style={{
              width: 32,
              height: 32,
              objectFit: 'contain',
              marginBottom: 14
            }}
          />
          <h1 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: 0, color: colors.text }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13.5, color: colors.textMuted, margin: '6px 0 0', textAlign: 'center' }}>
            Log in to access your Veedibox account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                placeholder="you@studio.com"
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

          <Button type="submit" disabled={submitting} style={{ width: '100%', padding: '13px 20px', marginTop: 8, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 14px', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: colors.border }} />
          <span style={{ fontSize: 12, color: colors.textMuted2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>or</span>
          <div style={{ flex: 1, height: 1, background: colors.border }} />
        </div>

        <Button
          type="button"
          onClick={() => signIn('google')}
          className="btn-interactive"
          style={{
            width: '100%',
            padding: '12px 20px',
            border: `1.5px solid ${colors.borderStrong}`,
            background: colors.surface,
            color: colors.text,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.07-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.79z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H.93v3.16C2.92 20.24 7.17 24 12 24z" />
            <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 5 12c0-.79.13-1.57.32-2.31V6.53H.93A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.25 5.37l4.07-3.13z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.17 0 2.92 3.76.93 7.74l4.07 3.13c.94-2.85 3.57-4.96 6.68-4.96z" />
          </svg>
          Continue with Google
        </Button>
      </div>

      <p style={{ fontSize: 13.5, color: colors.textMuted, marginTop: 24, textAlign: 'center' }}>
        New to Veedibox?{' '}
        <Link href="/register" style={{ color: colors.primary, fontWeight: 700 }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
