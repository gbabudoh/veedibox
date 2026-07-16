import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireSession } from '@/lib/auth/requireAdmin';
import { prisma } from '@/lib/db/client';
import { getUserOrders, getUserDownloads } from '@/lib/dashboard-data';
import { ORDER_STATUS_LABEL, LICENSE_TO_UI, LICENSE_META, formatUSD, hueFromId } from '@/lib/product-mapper';
import { resolvePreviewUrl } from '@/lib/product-preview';
import { PreviewTile } from '@/components/product/PreviewTile';
import { StatCard } from '@/components/dashboard/StatCard';
import { OverviewIcon, PurchasesIcon, DownloadsIcon } from '@/components/dashboard/icons';
import { colors, fonts, orderBadgeStyle, radii, shadows } from '@/lib/theme';

export default async function DashboardOverviewPage() {
  const session = await requireSession();
  if (!session) redirect('/login');

  const userId = (session.user as any).id;
  const [user, orders, downloads] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getUserOrders(userId),
    getUserDownloads(userId)
  ]);

  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const totalSpentCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);
  const now = new Date();
  const activeDownloads = downloads.filter((d) => d.token.expiresAt > now).length;
  const memberSince = user?.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) ?? '—';
  const firstName = session.user?.name?.split(' ')[0] || 'there';

  const recentOrders = orders.slice(0, 3);
  const recentDownloads = downloads.slice(0, 3);

  const cardStyle = { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 22 };
  const sectionHeaderStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 };
  const viewAllStyle = { fontSize: 12.5, fontWeight: 700, color: colors.primary };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 6px' }}>
          Welcome back, {firstName}
        </h1>
        <p style={{ fontSize: 14, color: colors.textMuted, margin: 0 }}>Here&apos;s what&apos;s happening with your Veedibox account.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total orders" value={String(orders.length)} icon={<PurchasesIcon />} />
        <StatCard label="Total spent" value={`$${formatUSD(totalSpentCents)}`} accent icon={<OverviewIcon />} />
        <StatCard
          label="Active downloads"
          value={String(activeDownloads)}
          sublabel={downloads.length > activeDownloads ? `${downloads.length - activeDownloads} expired` : undefined}
          icon={<DownloadsIcon />}
        />
        <StatCard label="Member since" value={memberSince} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Recent purchases</div>
            <Link href="/dashboard/purchases" style={viewAllStyle}>
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState message="No purchases yet." ctaLabel="Explore the shop" ctaHref="/shop/all" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentOrders.map((o) => (
                <div
                  key={o.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 4px', borderBottom: `1px solid ${colors.borderSubtle}` }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{o.id.slice(0, 10)}</div>
                    <div style={{ fontSize: 11.5, color: colors.textFaint }}>
                      {o.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {o.items.length} item{o.items.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>${formatUSD(o.totalCents)}</span>
                    <span style={orderBadgeStyle(ORDER_STATUS_LABEL[o.status])}>{ORDER_STATUS_LABEL[o.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Recent downloads</div>
            <Link href="/dashboard/downloads" style={viewAllStyle}>
              View all →
            </Link>
          </div>
          {recentDownloads.length === 0 ? (
            <EmptyState message="No downloads yet." ctaLabel="Explore the shop" ctaHref="/shop/all" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentDownloads.map(({ item, token }) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <PreviewTile
                    previewUrl={resolvePreviewUrl(item.product.previewKey)}
                    hue={hueFromId(item.product.id)}
                    alt={item.product.title}
                    containerStyle={{ width: 44, height: 44, borderRadius: radii.sm, flex: 'none' }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.title}</div>
                    <div style={{ fontSize: 11, color: colors.textFaint }}>{LICENSE_META[LICENSE_TO_UI[item.license]].label}</div>
                  </div>
                  {token.expiresAt > now ? (
                    <a
                      href={`/api/downloads/${token.token}`}
                      className="btn-interactive"
                      style={{ display: 'inline-block', fontSize: 11.5, fontWeight: 700, color: '#fff', background: colors.dark, padding: '7px 11px', borderRadius: radii.sm, whiteSpace: 'nowrap' }}
                    >
                      Download
                    </a>
                  ) : (
                    <span style={{ fontSize: 11, color: colors.textFaint }}>Expired</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {orders.length === 0 && (
        <div
          style={{
            marginTop: 24,
            background: colors.primaryGradient,
            borderRadius: radii.xxl,
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
            boxShadow: shadows.primaryGlow
          }}
        >
          <div>
            <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Nothing here yet</div>
            <div style={{ fontSize: 13.5, opacity: 0.9 }}>Browse wall art, stock imagery, and templates to get started.</div>
          </div>
          <Link
            href="/shop/all"
            style={{ background: '#fff', color: colors.primary, fontWeight: 700, fontSize: 14, padding: '12px 22px', borderRadius: radii.lg, whiteSpace: 'nowrap' }}
          >
            Explore the Shop
          </Link>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message, ctaLabel, ctaHref }: { message: string; ctaLabel: string; ctaHref: string }) {
  return (
    <div style={{ padding: '24px 4px', textAlign: 'center' }}>
      <div style={{ fontSize: 13, color: colors.textFaint, marginBottom: 10 }}>{message}</div>
      <Link href={ctaHref} style={{ fontSize: 12.5, fontWeight: 700, color: colors.primary }}>
        {ctaLabel} →
      </Link>
    </div>
  );
}
