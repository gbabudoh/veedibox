import { ButtonHTMLAttributes } from 'react';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const { variant = 'primary', style, ...rest } = props;
  const base: React.CSSProperties = {
    border: 'none', borderRadius: 10, padding: '12px 20px', fontWeight: 700, cursor: 'pointer',
    background: variant === 'primary' ? 'linear-gradient(135deg, oklch(58% 0.16 265), oklch(66% 0.14 220))' : '#fff',
    color: variant === 'primary' ? '#fff' : 'oklch(22% 0.02 265)'
  };
  return <button {...rest} style={{ ...base, ...style }} />;
}
