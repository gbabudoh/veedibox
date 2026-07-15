import { InputHTMLAttributes } from 'react';
import { colors, radii } from '@/lib/theme';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { style, ...rest } = props;
  const base: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: radii.md,
    border: `1px solid ${colors.borderStrong}`,
    fontSize: 14,
    fontFamily: 'inherit'
  };
  return <input {...rest} style={{ ...base, ...style }} />;
}
