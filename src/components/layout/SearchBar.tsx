'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { colors, radii } from '@/lib/theme';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const [query, setQuery] = useState(currentSearch);

  // Sync state with URL search param changes (e.g. if cleared from the page)
  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    // Determine target category URL. If we are on a shop page /shop/[category], search within that.
    // Otherwise search in /shop/all.
    let targetPath = '/shop/all';
    const match = pathname.match(/^\/shop\/([^/]+)$/);
    if (match) {
      targetPath = pathname;
    }

    const newParams = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      newParams.set('search', trimmed);
    } else {
      newParams.delete('search');
    }
    
    router.push(`${targetPath}?${newParams.toString()}`);
  };

  const handleClear = () => {
    setQuery('');
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('search');
    
    let targetPath = '/shop/all';
    const match = pathname.match(/^\/shop\/([^/]+)$/);
    if (match) {
      targetPath = pathname;
    }
    
    router.push(`${targetPath}?${newParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 14,
          display: 'flex',
          alignItems: 'center',
          color: colors.textMuted2,
          pointerEvents: 'none'
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find designs, art, templates..."
        style={{
          width: '100%',
          padding: '10px 80px 10px 38px',
          fontSize: 13.5,
          fontWeight: 500,
          fontFamily: 'inherit',
          color: colors.text,
          background: 'oklch(96% 0.008 85)',
          border: `1px solid ${colors.border}`,
          borderRadius: radii.xl,
          outline: 'none',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary;
          e.target.style.background = '#fff';
          e.target.style.boxShadow = `0 0 0 3px oklch(58% 0.16 265 / 0.12)`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border;
          e.target.style.background = 'oklch(96% 0.008 85)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: 56,
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textMuted2,
            borderRadius: '50%',
            transition: 'background-color 0.1s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'oklch(90% 0.01 85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
      <button
        type="submit"
        className="btn-interactive"
        style={{
          position: 'absolute',
          right: 5,
          top: '50%',
          transform: 'translateY(-50%)',
          height: 28,
          padding: '0 12px',
          border: 'none',
          background: colors.primaryGradient,
          color: '#fff',
          fontWeight: 700,
          fontSize: 12,
          borderRadius: 999,
          cursor: 'pointer',
          boxShadow: '0 2px 6px oklch(58% 0.16 265 / 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease'
        }}
      >
        Find
      </button>
    </form>
  );
}
