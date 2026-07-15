'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, fonts } from '@/lib/theme';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(res.status === 409 ? 'An account with this email already exists.' : body.error || 'Something went wrong.');
      setSubmitting(false);
      return;
    }
    const signInRes = await signIn('credentials', { email, password, redirect: false });
    setSubmitting(false);
    if (signInRes?.error) {
      router.push('/login');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '80px 32px 96px', animation: 'fadeIn 0.35s ease' }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 8px' }}>Create an account</h1>
      <p style={{ fontSize: 14, color: colors.textMuted, margin: '0 0 28px' }}>Join Veedibox to buy, download, and keep your library.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Name</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Amara Okafor" />
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Email</div>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Password</div>
          <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <div style={{ fontSize: 13, color: colors.danger }}>{error}</div>}
        <Button type="submit" disabled={submitting} style={{ width: '100%', padding: '13px 20px', marginTop: 8, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p style={{ fontSize: 13.5, color: colors.textMuted, marginTop: 20, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: colors.primary, fontWeight: 700 }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
