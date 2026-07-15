import type { CSSProperties } from 'react';

export const colors = {
  appBg: 'oklch(98% 0.008 85)',
  appBgAdmin: 'oklch(97% 0.006 85)',
  surface: '#fff',
  surfaceMuted: 'oklch(97% 0.006 85)',
  border: 'oklch(91% 0.01 85)',
  borderStrong: 'oklch(85% 0.01 85)',
  borderSubtle: 'oklch(93% 0.01 85)',
  text: 'oklch(22% 0.02 265)',
  textMuted: 'oklch(45% 0.02 265)',
  textMuted2: 'oklch(48% 0.02 265)',
  textFaint: 'oklch(50% 0.02 265)',
  primary: 'oklch(58% 0.16 265)',
  primarySoft: 'oklch(58% 0.16 265 / 0.1)',
  primarySofter: 'oklch(58% 0.16 265 / 0.06)',
  primaryGradient: 'linear-gradient(135deg, oklch(58% 0.16 265), oklch(66% 0.14 220))',
  heroGradient: 'linear-gradient(135deg, oklch(58% 0.16 265), oklch(70% 0.13 195))',
  dark: 'oklch(22% 0.02 265)',
  adminSidebar: 'oklch(19% 0.02 265)',
  tealAccent: 'oklch(75% 0.1 195)',
  success: 'oklch(55% 0.13 155)',
  successSoft: 'oklch(55% 0.13 155 / 0.12)',
  warn: 'oklch(60% 0.15 70)',
  warnSoft: 'oklch(60% 0.15 70 / 0.12)',
  neutral: 'oklch(55% 0.02 265)',
  neutralSoft: 'oklch(55% 0.02 265 / 0.1)',
  danger: 'oklch(50% 0.18 25)',
  dangerBorder: 'oklch(85% 0.08 25)'
} as const;

export const fonts = {
  heading: 'var(--font-manrope), sans-serif',
  body: 'var(--font-public-sans), system-ui, sans-serif'
} as const;

export const radii = { sm: 8, md: 10, lg: 12, xl: 14, xxl: 16, xxxl: 18, pill: 999 } as const;

export const shadows = {
  primaryGlow: '0 10px 24px oklch(58% 0.16 265 / 0.28)',
  modal: '0 30px 80px rgba(0,0,0,0.3)',
  drawer: '-12px 0 40px rgba(0,0,0,0.15)',
  card: '0 1px 2px rgba(16,24,40,0.03), 0 1px 3px rgba(16,24,40,0.04)',
  cardLift: '0 4px 16px rgba(16,24,40,0.07), 0 1px 3px rgba(16,24,40,0.04)'
} as const;

export const maxWidth = { page: 1280, checkout: 1000, confirmation: 600 } as const;

// Placeholder gradient tile standing in for a real preview image (phase 2 swaps this for imgproxyUrl()).
export function bgFor(hue: number): CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 14px), linear-gradient(135deg, oklch(88% 0.06 ${hue}), oklch(68% 0.11 ${hue + 45}))`
  };
}

export function orderBadgeStyle(status: 'Paid' | 'Refunded' | 'Pending'): CSSProperties {
  const textColor = { Paid: colors.success, Refunded: colors.neutral, Pending: colors.warn }[status];
  const bg = { Paid: colors.successSoft, Refunded: colors.neutralSoft, Pending: colors.warnSoft }[status];
  return { fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: radii.pill, color: textColor, background: bg };
}

export function roleBadgeStyle(role: 'Customer' | 'Admin' | 'Super Admin' | 'Creator'): CSSProperties {
  const textColor = { Customer: colors.textMuted, Admin: colors.primary, 'Super Admin': colors.danger, Creator: 'oklch(55% 0.13 195)' }[role];
  const bg = { Customer: 'oklch(45% 0.02 265 / 0.08)', Admin: colors.primarySoft, 'Super Admin': 'oklch(50% 0.18 25 / 0.12)', Creator: 'oklch(55% 0.13 195 / 0.12)' }[role];
  return { fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: radii.pill, color: textColor, background: bg };
}

export function statusBadgeStyle(status: 'Active' | 'Suspended'): CSSProperties {
  const textColor = status === 'Active' ? colors.success : colors.danger;
  const bg = status === 'Active' ? colors.successSoft : 'oklch(50% 0.18 25 / 0.12)';
  return { fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: radii.pill, color: textColor, background: bg };
}
