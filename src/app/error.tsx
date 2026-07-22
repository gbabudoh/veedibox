'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { colors, fonts } from '@/lib/theme';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        textAlign: 'center',
        fontFamily: 'var(--font-public-sans), system-ui, sans-serif'
      }}
    >
      <div style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, marginBottom: 10, color: colors.text }}>
        Something went wrong
      </div>
      <p style={{ fontSize: 15, color: colors.textMuted, maxWidth: 420, marginBottom: 24, lineHeight: 1.6 }}>
        This one's on us — the page hit an unexpected error. Try again, or head back home.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={reset}
          style={{
            border: 'none',
            background: colors.primaryGradient,
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            padding: '12px 22px',
            borderRadius: 10,
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            border: `1px solid ${colors.borderStrong}`,
            background: colors.surface,
            color: colors.text,
            fontWeight: 700,
            fontSize: 14,
            padding: '12px 22px',
            borderRadius: 10,
            display: 'inline-block'
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
