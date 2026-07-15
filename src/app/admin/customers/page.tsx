import Link from 'next/link';
import { prisma } from '@/lib/db/client';
import { ROLE_LABEL } from '@/lib/product-mapper';
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable';
import { Avatar } from '@/components/ui/Avatar';
import { colors, fonts, roleBadgeStyle, statusBadgeStyle } from '@/lib/theme';

const COLUMNS = [
  { label: 'Customer', width: '1.6fr' },
  { label: 'Role', width: '100px' },
  { label: 'Status', width: '110px' },
  { label: 'Joined', width: '100px' },
  { label: '', width: '90px' }
];

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: { in: ['CUSTOMER', 'CREATOR'] } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>Customers</h1>
        <span style={{ fontSize: 13, color: colors.textFaint }}>{customers.length} account{customers.length === 1 ? '' : 's'}</span>
      </div>
      <AdminTable columns={COLUMNS} empty={{ message: 'No customer accounts yet.' }}>
        {customers.map((u) => (
          <AdminTableRow key={u.id} columns={COLUMNS}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Avatar name={u.name} email={u.email} size={30} style={{ fontSize: 11 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name ?? '—'}</div>
                <div style={{ fontSize: 12, color: colors.textFaint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
              </div>
            </div>
            <div>
              <span style={roleBadgeStyle(ROLE_LABEL[u.role])}>{ROLE_LABEL[u.role]}</span>
            </div>
            <div>
              <span style={statusBadgeStyle(u.status === 'ACTIVE' ? 'Active' : 'Suspended')}>{u.status === 'ACTIVE' ? 'Active' : 'Suspended'}</span>
            </div>
            <div style={{ color: colors.textMuted2 }}>{u.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
            <div>
              <Link
                href={`/admin/customers/${u.id}`}
                className="admin-btn"
                style={{ border: `1px solid ${colors.border}`, background: colors.surface, fontSize: 12, fontWeight: 700, padding: '6px 10px', borderRadius: 7, display: 'inline-block' }}
              >
                View
              </Link>
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
}
