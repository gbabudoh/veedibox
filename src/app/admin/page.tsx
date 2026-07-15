import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/client';
import { formatUSD, CATEGORY_LABELS, CATEGORY_TO_URL, ORDER_STATUS_LABEL, UrlCategory } from '@/lib/product-mapper';
import { StatCard } from '@/components/dashboard/StatCard';
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable';
import { Avatar } from '@/components/ui/Avatar';
import { OverviewIcon, OrdersIcon, CustomersIcon, WallArtIcon, StockIcon, TemplatesIcon, BundlesIcon } from '@/components/admin/icons';
import { colors, fonts, orderBadgeStyle, radii, shadows } from '@/lib/theme';

const CATEGORY_HUES: Record<UrlCategory, number> = { 'wall-art': 32, stock: 24, templates: 282, bundles: 12 };
const CATEGORY_ICONS: Record<UrlCategory, React.ReactNode> = {
  'wall-art': <WallArtIcon />,
  stock: <StockIcon />,
  templates: <TemplatesIcon />,
  bundles: <BundlesIcon />
};

const ACTION_LABELS: Record<string, string> = {
  'product.create': 'Created product',
  'product.update': 'Updated product',
  'product.delete': 'Deleted product',
  'user.suspend': 'Suspended account',
  'user.reactivate': 'Reactivated account',
  'user.role_change': 'Changed role',
  'admin.create': 'Created admin account'
};

const ORDER_COLUMNS = [
  { label: 'Order', width: '1fr' },
  { label: 'Customer', width: '1.3fr' },
  { label: 'Total', width: '90px' },
  { label: 'Status', width: '110px' }
];

export default async function AdminOverviewPage() {
  const session = await requireAdmin();
  if (!session) redirect('/admin-login');
  const isSuperAdmin = (session.user as any)?.role === 'SUPER_ADMIN';

  const [revenueAgg, orderCount, productCount, customerCount, categoryCounts, recentOrders, recentAuditLog] = await Promise.all([
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { totalCents: true } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: { in: ['CUSTOMER', 'CREATOR'] } } }),
    prisma.product.groupBy({ by: ['category'], _count: { _all: true } }),
    prisma.order.findMany({ include: { user: true, items: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    isSuperAdmin ? prisma.auditLog.findMany({ include: { actor: true }, orderBy: { createdAt: 'desc' }, take: 5 }) : Promise.resolve([])
  ]);

  const countByCategory = new Map(categoryCounts.map((c) => [CATEGORY_TO_URL[c.category], c._count._all]));
  const categories: UrlCategory[] = ['wall-art', 'stock', 'templates', 'bundles'];

  const firstName = session.user?.name?.split(' ')[0] || 'there';

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 25, fontWeight: 800, letterSpacing: -0.4, margin: '0 0 6px' }}>
          Welcome back, {firstName}
        </h1>
        <p style={{ fontSize: 14, color: colors.textMuted, margin: 0 }}>Here&apos;s what&apos;s happening across Veedibox.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total revenue" value={`$${formatUSD(revenueAgg._sum.totalCents ?? 0)}`} accent icon={<OverviewIcon />} />
        <StatCard label="Orders" value={String(orderCount)} icon={<OrdersIcon />} />
        <StatCard label="Products" value={String(productCount)} />
        <StatCard label="Customers" value={String(customerCount)} icon={<CustomersIcon />} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
        Catalog at a glance
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/admin/catalog/${c}`}
            className="admin-card-hover"
            style={{
              display: 'block',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radii.xl,
              padding: 18,
              boxShadow: shadows.card
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: colors.primarySoft,
                color: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}
            >
              {CATEGORY_ICONS[c]}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{CATEGORY_LABELS[c]}</div>
            <div style={{ fontSize: 12.5, color: colors.textFaint }}>{countByCategory.get(c) ?? 0} item{(countByCategory.get(c) ?? 0) === 1 ? '' : 's'}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isSuperAdmin ? '1.3fr 1fr' : '1fr', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent orders</div>
            <Link href="/admin/orders" style={{ fontSize: 12.5, fontWeight: 700, color: colors.primary }}>
              View all →
            </Link>
          </div>
          <AdminTable columns={ORDER_COLUMNS} empty={{ message: "No orders yet — they'll show up here once a customer completes a purchase." }}>
            {recentOrders.map((o) => (
              <AdminTableRow key={o.id} columns={ORDER_COLUMNS}>
                <div style={{ fontWeight: 700 }}>{o.id.slice(0, 10)}</div>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.user.name ?? o.user.email}</div>
                <div style={{ fontWeight: 700 }}>${formatUSD(o.totalCents)}</div>
                <div>
                  <span style={orderBadgeStyle(ORDER_STATUS_LABEL[o.status])}>{ORDER_STATUS_LABEL[o.status]}</span>
                </div>
              </AdminTableRow>
            ))}
          </AdminTable>
        </div>

        {isSuperAdmin && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent activity</div>
              <Link href="/admin/audit-log" style={{ fontSize: 12.5, fontWeight: 700, color: colors.primary }}>
                View all →
              </Link>
            </div>
            <div className="admin-card-hover" style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 8, boxShadow: shadows.card }}>
              {recentAuditLog.length === 0 ? (
                <div style={{ padding: '32px 12px', textAlign: 'center', color: colors.textFaint, fontSize: 13 }}>No admin activity yet.</div>
              ) : (
                recentAuditLog.map((e) => (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px' }}>
                    <Avatar name={e.actor.name} email={e.actor.email} size={26} style={{ fontSize: 10 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ACTION_LABELS[e.action] ?? e.action}
                      </div>
                      <div style={{ fontSize: 11, color: colors.textFaint }}>
                        {e.actor.name ?? e.actor.email} · {e.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
