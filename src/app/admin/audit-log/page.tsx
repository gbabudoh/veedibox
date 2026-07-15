import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/auth/requireAdmin';
import { prisma } from '@/lib/db/client';
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable';
import { Avatar } from '@/components/ui/Avatar';
import { colors, fonts } from '@/lib/theme';

const ACTION_LABELS: Record<string, string> = {
  'product.create': 'Created product',
  'product.update': 'Updated product',
  'product.delete': 'Deleted product',
  'user.suspend': 'Suspended account',
  'user.reactivate': 'Reactivated account',
  'user.role_change': 'Changed role',
  'admin.create': 'Created admin account'
};

const ACTION_ACCENT: Record<string, string> = {
  product: colors.primary,
  user: colors.warn,
  admin: colors.danger
};

function actionPillStyle(action: string) {
  const prefix = action.split('.')[0];
  const color = ACTION_ACCENT[prefix] ?? colors.textMuted;
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12.5,
    fontWeight: 700,
    color
  };
}

const COLUMNS = [
  { label: 'Actor', width: '1.2fr' },
  { label: 'Action', width: '1.6fr' },
  { label: 'Details', width: '1.6fr' },
  { label: 'When', width: '1.2fr' }
];

export default async function AdminAuditLogPage() {
  const session = await requireSuperAdmin();
  if (!session) redirect('/admin/catalog/wall-art');

  const entries = await prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: 'desc' },
    take: 200
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>Audit Log</h1>
        <span style={{ fontSize: 13, color: colors.textFaint }}>Last {entries.length} events</span>
      </div>
      <AdminTable columns={COLUMNS} empty={{ message: 'No admin activity recorded yet.' }}>
        {entries.map((e) => (
          <AdminTableRow key={e.id} columns={COLUMNS}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
              <Avatar name={e.actor.name} email={e.actor.email} size={26} style={{ fontSize: 10 }} />
              <span style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.actor.name ?? e.actor.email}</span>
            </div>
            <div>
              <span style={actionPillStyle(e.action)}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                {ACTION_LABELS[e.action] ?? e.action}
              </span>
            </div>
            <div style={{ color: colors.textMuted2, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {e.metadata ? JSON.stringify(e.metadata) : `${e.targetType} · ${e.targetId.slice(0, 10)}`}
            </div>
            <div style={{ color: colors.textMuted2, fontSize: 12 }}>
              {e.createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
}
