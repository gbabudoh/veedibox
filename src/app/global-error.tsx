'use client';

import { useEffect } from 'react';

// Catches errors thrown by the root layout itself (rare) — must render its own <html>/<body>
// since it replaces the root layout entirely when active, so it can't rely on layout.tsx's fonts
// or providers.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Something went wrong</div>
          <p style={{ fontSize: 15, color: '#666', maxWidth: 420, marginBottom: 24, lineHeight: 1.6 }}>
            The app hit an unexpected error loading this page. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              border: 'none',
              background: '#1a1a2e',
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
        </div>
      </body>
    </html>
  );
}
