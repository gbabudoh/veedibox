import { prisma } from '@/lib/db/client';
import { formatUSD, CATEGORY_LABELS, LICENSE_META, LICENSE_TO_UI, UrlCategory } from '@/lib/product-mapper';
import { StatCard } from '@/components/dashboard/StatCard';
import { AnalyticsIcon, OrdersIcon } from '@/components/admin/icons';
import { colors, fonts, radii, shadows } from '@/lib/theme';

interface RevenueRow {
  month: Date;
  total_cents: bigint;
}

export default async function AdminAnalyticsPage() {
  const [revenueAgg, downloadCount, revenueByMonth, orderCounts, paidItems] = await Promise.all([
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { totalCents: true }, _count: { _all: true } }),
    prisma.downloadToken.count(),
    prisma.$queryRaw<RevenueRow[]>`
      SELECT date_trunc('month', "createdAt") AS month, SUM("totalCents")::bigint AS total_cents
      FROM "Order"
      WHERE status = 'PAID' AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,
    prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.orderItem.findMany({ where: { order: { status: 'PAID' } }, include: { product: true } })
  ]);

  const totalRevenueCents = revenueAgg._sum.totalCents ?? 0;
  const paidOrderCount = revenueAgg._count._all;
  const totalOrderCount = orderCounts.reduce((sum, o) => sum + o._count._all, 0);
  const refundedCount = orderCounts.find((o) => o.status === 'REFUNDED')?._count._all ?? 0;
  const avgOrderValueCents = paidOrderCount > 0 ? Math.round(totalRevenueCents / paidOrderCount) : 0;
  const refundRate = totalOrderCount > 0 ? ((refundedCount / totalOrderCount) * 100).toFixed(1) : '0.0';

  const statCards = [
    { label: 'Total revenue', value: `$${formatUSD(totalRevenueCents)}`, accent: true, icon: <OrdersIcon /> },
    { label: 'Paid orders', value: String(paidOrderCount), icon: <AnalyticsIcon /> },
    { label: 'Avg order value', value: `$${formatUSD(avgOrderValueCents)}` },
    { label: 'Refund rate', value: `${refundRate}%` }
  ];

  const maxCents = Math.max(1, ...revenueByMonth.map((r) => Number(r.total_cents)));
  const revenueBars = revenueByMonth.map((r) => ({
    label: r.month.toLocaleDateString('en-US', { month: 'short' }),
    heightPct: Math.round((Number(r.total_cents) / maxCents) * 100)
  }));

  const byCategory = new Map<UrlCategory, number>();
  const byLicense = new Map<string, number>();
  const byProduct = new Map<string, { title: string; cents: number }>();

  for (const item of paidItems) {
    const category = item.product.category;
    const categoryUrl = (
      { WALL_ART: 'wall-art', STOCK: 'stock', TEMPLATES: 'templates', BUNDLES: 'bundles' } as const
    )[category];
    byCategory.set(categoryUrl, (byCategory.get(categoryUrl) ?? 0) + item.priceCents);

    const licenseUi = LICENSE_TO_UI[item.license];
    byLicense.set(licenseUi, (byLicense.get(licenseUi) ?? 0) + item.priceCents);

    const existing = byProduct.get(item.productId);
    byProduct.set(item.productId, { title: item.product.title, cents: (existing?.cents ?? 0) + item.priceCents });
  }

  const categoryBreakdown = (['wall-art', 'stock', 'templates', 'bundles'] as UrlCategory[])
    .map((c) => ({ label: CATEGORY_LABELS[c], cents: byCategory.get(c) ?? 0 }))
    .sort((a, b) => b.cents - a.cents);
  const maxCategoryCents = Math.max(1, ...categoryBreakdown.map((c) => c.cents));

  const licenseBreakdown = (['personal', 'commercial', 'extended'] as const)
    .map((l) => ({ label: LICENSE_META[l].label, cents: byLicense.get(l) ?? 0 }))
    .sort((a, b) => b.cents - a.cents);
  const maxLicenseCents = Math.max(1, ...licenseBreakdown.map((l) => l.cents));

  const topProducts = [...byProduct.values()].sort((a, b) => b.cents - a.cents).slice(0, 5);

  const breakdownBar = (label: string, cents: number, maxCents: number) => (
    <div key={label} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
        <span style={{ color: colors.textMuted }}>{label}</span>
        <span style={{ fontWeight: 700 }}>${formatUSD(cents)}</span>
      </div>
      <div style={{ background: colors.surfaceMuted, borderRadius: 999, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${Math.round((cents / maxCents) * 100)}%`, height: '100%', background: colors.primaryGradient }} />
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: '0 0 24px', letterSpacing: -0.3 }}>Analytics</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} accent={s.accent} icon={s.icon} />
        ))}
      </div>

      <div className="admin-card-hover" style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 24, marginBottom: 24, boxShadow: shadows.card }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 20 }}>Revenue by month</div>
        {revenueBars.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: colors.textFaint, fontSize: 13.5 }}>No paid orders yet.</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180 }}>
            {revenueBars.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    borderRadius: '6px 6px 0 0',
                    background: 'linear-gradient(180deg, oklch(66% 0.14 220), oklch(58% 0.16 265))',
                    height: `${b.heightPct}%`
                  }}
                />
                <div style={{ fontSize: 11.5, color: colors.textFaint, fontWeight: 600 }}>{b.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="admin-card-hover" style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 24, boxShadow: shadows.card }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 18 }}>Revenue by category</div>
          {paidItems.length === 0 ? (
            <div style={{ color: colors.textFaint, fontSize: 13 }}>No paid orders yet.</div>
          ) : (
            categoryBreakdown.map((c) => breakdownBar(c.label, c.cents, maxCategoryCents))
          )}
        </div>
        <div className="admin-card-hover" style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 24, boxShadow: shadows.card }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 18 }}>Revenue by licence</div>
          {paidItems.length === 0 ? (
            <div style={{ color: colors.textFaint, fontSize: 13 }}>No paid orders yet.</div>
          ) : (
            licenseBreakdown.map((l) => breakdownBar(l.label, l.cents, maxLicenseCents))
          )}
        </div>
      </div>

      <div className="admin-card-hover" style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 24, boxShadow: shadows.card }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 18 }}>Top products by revenue</div>
        {topProducts.length === 0 ? (
          <div style={{ color: colors.textFaint, fontSize: 13 }}>No paid orders yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {topProducts.map((p, i) => (
              <div key={p.title + i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < topProducts.length - 1 ? `1px solid ${colors.borderSubtle}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: colors.textFaint, width: 18 }}>#{i + 1}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{p.title}</span>
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>${formatUSD(p.cents)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: colors.textFaint }}>Downloads issued: {downloadCount}</div>
    </div>
  );
}
