import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db/client';
import { getUserOrders, getUserDownloads } from '@/lib/dashboard-data';
import { ROLE_LABEL, ORDER_STATUS_LABEL, formatUSD } from '@/lib/product-mapper';
import { Avatar } from '@/components/ui/Avatar';
import { StatCard } from '@/components/dashboard/StatCard';
import { CustomerActions } from '@/components/admin/CustomerActions';
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable';
import { colors, fonts, orderBadgeStyle, radii, roleBadgeStyle, shadows, statusBadgeStyle } from '@/lib/theme';

const COLUMNS = [
  { label: 'Order', width: '1fr' },
  { label: 'Items', width: '100px' },
  { label: 'Total', width: '100px' },
  { label: 'Status', width: '110px' }
];

export default async function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();

  const [orders, downloads] = await Promise.all([getUserOrders(user.id), getUserDownloads(user.id)]);
  const totalSpentCents = orders.filter((o) => o.status === 'PAID').reduce((sum, o) => sum + o.totalCents, 0);

  return (
    <div>
      <Link href="/admin/customers" style={{ fontSize: 13, color: colors.textFaint, marginBottom: 16, display: 'inline-block' }}>
        ← All customers
      </Link>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.xl,
          padding: 20,
          boxShadow: shadows.card
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={user.name} email={user.email} size={48} />
          <div>
            <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 19, letterSpacing: -0.3 }}>{user.name || user.email}</div>
            <div style={{ fontSize: 13, color: colors.textFaint }}>{user.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={roleBadgeStyle(ROLE_LABEL[user.role])}>{ROLE_LABEL[user.role]}</span>
          <span style={statusBadgeStyle(user.status === 'ACTIVE' ? 'Active' : 'Suspended')}>{user.status === 'ACTIVE' ? 'Active' : 'Suspended'}</span>
          <CustomerActions userId={user.id} status={user.status} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total spent" value={`$${formatUSD(totalSpentCents)}`} accent />
        <StatCard label="Orders" value={String(orders.length)} />
        <StatCard label="Active downloads" value={String(downloads.filter((d) => d.token.expiresAt > new Date()).length)} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
        Order history
      </div>
      <AdminTable columns={COLUMNS} empty={{ message: 'No orders from this customer yet.' }}>
        {orders.map((o) => (
          <AdminTableRow key={o.id} columns={COLUMNS}>
            <div>
              <div style={{ fontWeight: 700 }}>{o.id.slice(0, 10)}</div>
              <div style={{ fontSize: 12, color: colors.textFaint }}>{o.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div>{o.items.length}</div>
            <div style={{ fontWeight: 700 }}>${formatUSD(o.totalCents)}</div>
            <div>
              <span style={orderBadgeStyle(ORDER_STATUS_LABEL[o.status])}>{ORDER_STATUS_LABEL[o.status]}</span>
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
}
