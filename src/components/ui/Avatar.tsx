import { CSSProperties } from 'react';
import { colors } from '@/lib/theme';

function initialsFrom(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return '?';
}

export function Avatar({
  name,
  email,
  size = 40,
  style
}: {
  name?: string | null;
  email?: string | null;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: colors.heroGradient,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.4,
        flex: 'none',
        ...style
      }}
    >
      {initialsFrom(name, email)}
    </div>
  );
}
