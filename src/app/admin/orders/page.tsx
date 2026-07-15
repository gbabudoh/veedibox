import { prisma } from '@/lib/db/client';
import { ORDER_STATUS_LABEL, formatUSD } from '@/lib/product-mapper';
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrdersIcon } from '@/components/admin/icons';
import { colors, fonts, orderBadgeStyle } from '@/lib/theme';

const COLUMNS = [
  { label: 'Order', width: '1fr' },
  { label: 'Customer', width: '1.4fr' },
  { label: 'Date', width: '1fr' },
  { label: 'Total', width: '90px' },
  { label: 'Status', width: '120px' }
];

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ include: { user: true, items: true }, orderBy: { createdAt: 'desc' } });
  const paidRevenueCents = orders.filter((o) => o.status === 'PAID').reduce((sum, o) => sum + o.totalCents, 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>Orders</h1>
        <span style={{ fontSize: 13, color: colors.textFaint }}>{orders.length} total</span>
      </div>

      {orders.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Paid revenue" value={`$${formatUSD(paidRevenueCents)}`} accent icon={<OrdersIcon />} />
          <StatCard label="Total orders" value={String(orders.length)} />
          <StatCard label="Pending" value={String(pendingCount)} />
        </div>
      )}

      <AdminTable columns={COLUMNS} empty={{ message: "No orders yet — they'll show up here once a customer completes a purchase." }}>
        {orders.map((o) => (
          <AdminTableRow key={o.id} columns={COLUMNS}>
            <div style={{ fontWeight: 700 }}>{o.id.slice(0, 10)}</div>
            <div>{o.user.name ?? o.user.email}</div>
            <div style={{ color: colors.textMuted2 }}>{o.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
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
