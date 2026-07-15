import { ReactNode } from 'react';
import { colors, fonts, radii, shadows } from '@/lib/theme';

export function StatCard({
  label,
  value,
  sublabel,
  accent = false,
  icon
}: {
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      className="admin-card-hover"
      style={{
        background: accent ? colors.primaryGradient : colors.surface,
        border: accent ? 'none' : `1px solid ${colors.border}`,
        borderRadius: radii.xl,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: accent ? shadows.primaryGlow : shadows.card
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: accent ? 'rgba(255,255,255,0.85)' : colors.textFaint,
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}
        >
          {label}
        </div>
        {icon && (
          <div
            style={{
              color: accent ? '#fff' : colors.primary,
              opacity: accent ? 0.95 : 1,
              display: 'flex',
              width: 28,
              height: 28,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              background: accent ? 'rgba(255,255,255,0.16)' : colors.primarySoft
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontFamily: fonts.heading, fontSize: 25, fontWeight: 800, color: accent ? '#fff' : colors.text, letterSpacing: -0.3 }}>{value}</div>
      {sublabel && (
        <div style={{ fontSize: 12, color: accent ? 'rgba(255,255,255,0.8)' : colors.textFaint }}>{sublabel}</div>
      )}
    </div>
  );
}
