import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireSession } from '@/lib/auth/requireAdmin';
import { getUserOrders } from '@/lib/dashboard-data';
import { ORDER_STATUS_LABEL, formatUSD } from '@/lib/product-mapper';
import { StatCard } from '@/components/dashboard/StatCard';
import { colors, fonts, orderBadgeStyle, radii } from '@/lib/theme';

export default async function DashboardPurchasesPage() {
  const session = await requireSession();
  if (!session) redirect('/login');

  const orders = await getUserOrders((session.user as any).id);
  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const totalSpentCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);
  const lastOrder = orders[0];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 24, fontWeight: 800, margin: 0 }}>Purchases</h1>
        <span style={{ fontSize: 13, color: colors.textFaint }}>{orders.length} order{orders.length === 1 ? '' : 's'}</span>
      </div>

      {orders.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Total spent" value={`$${formatUSD(totalSpentCents)}`} accent />
          <StatCard label="Orders placed" value={String(orders.length)} />
          <StatCard label="Last order" value={lastOrder.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
        </div>
      )}

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 100px 110px',
            padding: '14px 18px',
            fontSize: 12,
            fontWeight: 700,
            color: colors.textFaint,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            background: colors.surfaceMuted
          }}
        >
          <div>Order</div>
          <div>Items</div>
          <div>Total</div>
          <div>Status</div>
        </div>
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 100px 110px',
              padding: '14px 18px',
              fontSize: 13.5,
              borderTop: `1px solid ${colors.borderSubtle}`,
              alignItems: 'center',
              transition: 'background 0.15s'
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{o.id.slice(0, 10)}</div>
              <div style={{ fontSize: 12, color: colors.textFaint }}>{o.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div>{o.items.length}</div>
            <div style={{ fontWeight: 700 }}>${formatUSD(o.totalCents)}</div>
            <div>
              <span style={orderBadgeStyle(ORDER_STATUS_LABEL[o.status])}>{ORDER_STATUS_LABEL[o.status]}</span>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div style={{ padding: '56px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: colors.textFaint, marginBottom: 14 }}>You haven&apos;t made any purchases yet.</div>
            <Link
              href="/shop/all"
              style={{ display: 'inline-block', background: colors.primaryGradient, color: '#fff', fontWeight: 700, fontSize: 13.5, padding: '11px 20px', borderRadius: radii.md }}
            >
              Explore the Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
