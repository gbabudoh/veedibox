'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors, radii } from '@/lib/theme';

type ProductStatus = 'draft' | 'published';

export function ProductStatusToggle({ productId, status }: { productId: string; status: string }) {
  const [current, setCurrent] = useState<ProductStatus>(status === 'published' ? 'published' : 'draft');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const setStatus = async (next: ProductStatus) => {
    if (next === current || loading) return;
    const prev = current;
    setCurrent(next);
    setLoading(true);
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next })
    });
    setLoading(false);
    if (!res.ok) {
      setCurrent(prev);
      return;
    }
    router.refresh();
  };

  const segmentStyle = (selected: boolean, tone: 'active' | 'inactive') => ({
    border: 'none',
    background: selected ? (tone === 'active' ? colors.successSoft : colors.neutralSoft) : 'transparent',
    color: selected ? (tone === 'active' ? colors.success : colors.neutral) : colors.textFaint,
    fontWeight: 700,
    fontSize: 11.5,
    padding: '5px 10px',
    borderRadius: radii.pill,
    cursor: loading ? 'not-allowed' : 'pointer'
  });

  return (
    <div
      className="admin-btn"
      style={{
        display: 'inline-flex',
        border: `1px solid ${colors.border}`,
        borderRadius: radii.pill,
        padding: 2,
        opacity: loading ? 0.6 : 1,
        background: colors.surfaceMuted
      }}
    >
      <button onClick={() => setStatus('published')} disabled={loading} style={segmentStyle(current === 'published', 'active')}>
        Active
      </button>
      <button onClick={() => setStatus('draft')} disabled={loading} style={segmentStyle(current === 'draft', 'inactive')}>
        Inactive
      </button>
    </div>
  );
}
