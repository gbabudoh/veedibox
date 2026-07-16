'use client';

import { ButtonHTMLAttributes, useState } from 'react';
import { colors } from '@/lib/theme';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const { variant = 'primary', style, ...rest } = props;
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const base: React.CSSProperties = {
    border: variant === 'secondary' ? `1px solid ${colors.borderStrong}` : 'none',
    borderRadius: 10,
    padding: '12px 20px',
    fontWeight: 700,
    cursor: 'pointer',
    background: variant === 'primary'
      ? 'linear-gradient(135deg, oklch(58% 0.16 265), oklch(66% 0.14 220))'
      : '#fff',
    color: variant === 'primary' ? '#fff' : 'oklch(22% 0.02 265)',
    transform: active ? 'scale(0.96)' : (hovered ? 'scale(1.02)' : 'scale(1)'),
    boxShadow: hovered && variant === 'primary'
      ? '0 6px 16px oklch(58% 0.16 265 / 0.2)'
      : 'none',
    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
    filter: hovered ? 'brightness(1.04)' : 'none'
  };

  return (
    <button
      {...rest}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{ ...base, ...style }}
    />
  );
}
