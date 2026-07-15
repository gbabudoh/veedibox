import { CSSProperties, ReactNode } from 'react';
import { colors, radii, shadows } from '@/lib/theme';

export interface AdminTableColumn {
  label: string;
  width?: string;
}

function gridStyle(columns: AdminTableColumn[]): CSSProperties {
  return { display: 'grid', gridTemplateColumns: columns.map((c) => c.width ?? '1fr').join(' ') };
}

export function AdminTable({
  columns,
  children,
  empty
}: {
  columns: AdminTableColumn[];
  children: ReactNode;
  empty?: { message: string; action?: ReactNode };
}) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, overflow: 'hidden', boxShadow: shadows.card }}>
      <div
        style={{
          ...gridStyle(columns),
          padding: '13px 20px',
          fontSize: 11,
          fontWeight: 700,
          color: colors.textFaint,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          background: colors.surfaceMuted,
          borderBottom: `1px solid ${colors.borderSubtle}`
        }}
      >
        {columns.map((c) => (
          <div key={c.label}>{c.label}</div>
        ))}
      </div>
      {hasRows ? (
        children
      ) : (
        <div style={{ padding: '52px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: colors.textFaint, marginBottom: empty?.action ? 14 : 0 }}>{empty?.message}</div>
          {empty?.action}
        </div>
      )}
    </div>
  );
}

export function AdminTableRow({ columns, children }: { columns: AdminTableColumn[]; children: ReactNode }) {
  return (
    <div
      className="admin-row"
      style={{
        ...gridStyle(columns),
        padding: '13px 20px',
        fontSize: 13.5,
        borderTop: `1px solid ${colors.borderSubtle}`,
        alignItems: 'center'
      }}
    >
      {children}
    </div>
  );
}
