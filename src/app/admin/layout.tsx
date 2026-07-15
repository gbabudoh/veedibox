import { redirect } from 'next/navigation';
import { NavLink } from '@/components/ui/NavLink';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { AdminUserCard } from '@/components/admin/AdminUserCard';
import {
  OverviewIcon,
  WallArtIcon,
  StockIcon,
  TemplatesIcon,
  BundlesIcon,
  OrdersIcon,
  CustomersIcon,
  AnalyticsIcon,
  TeamIcon,
  AuditLogIcon
} from '@/components/admin/icons';
import { colors, fonts } from '@/lib/theme';

const CATALOG_TABS = [
  { href: '/admin/catalog/wall-art', label: 'Wall Art', icon: <WallArtIcon /> },
  { href: '/admin/catalog/stock', label: 'Stock Images', icon: <StockIcon /> },
  { href: '/admin/catalog/templates', label: 'Templates', icon: <TemplatesIcon /> },
  { href: '/admin/catalog/bundles', label: 'Bundles', icon: <BundlesIcon /> }
];

const OPERATIONS_TABS = [
  { href: '/admin/orders', label: 'Orders', icon: <OrdersIcon /> },
  { href: '/admin/customers', label: 'Customers', icon: <CustomersIcon /> }
];

const ANALYTICS_TABS = [{ href: '/admin/analytics', label: 'Analytics', icon: <AnalyticsIcon /> }];

const SUPER_ADMIN_TABS = [
  { href: '/admin/team', label: 'Team', icon: <TeamIcon /> },
  { href: '/admin/audit-log', label: 'Audit Log', icon: <AuditLogIcon /> }
];

function NavGroup({
  title,
  tabs,
  activeStyle,
  inactiveStyle
}: {
  title?: string;
  tabs: { href: string; label: string; icon: React.ReactNode; exact?: boolean }[];
  activeStyle: any;
  inactiveStyle: any;
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      {title && (
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', padding: '0 14px 9px' }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {tabs.map((t) => (
          <NavLink key={t.href} href={t.href} exact={t.exact} className="admin-nav-link" activeStyle={activeStyle} inactiveStyle={inactiveStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span style={{ display: 'flex', opacity: 0.9 }}>{t.icon}</span>
              {t.label}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

// Middleware already redirects non-admins away; this is defense-in-depth in case the matcher is ever misconfigured.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (!session) redirect('/admin-login');
  const isSuperAdmin = (session.user as any)?.role === 'SUPER_ADMIN';

  const activeStyle = { background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: 13.5, padding: '10px 14px', borderRadius: 10, display: 'block' };
  const inactiveStyle = { background: 'transparent', color: 'rgba(255,255,255,0.62)', fontWeight: 600, fontSize: 13.5, padding: '10px 14px', borderRadius: 10, display: 'block' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '256px 1fr', minHeight: '100vh' }}>
      <div style={{ background: colors.adminSidebar, color: '#fff', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 18.5, display: 'flex', alignItems: 'center', gap: 9, padding: '22px 22px 6px' }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: colors.heroGradient, display: 'inline-block' }} />
          Veedibox
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: colors.tealAccent,
              background: 'rgba(255,255,255,0.08)',
              padding: '3px 8px',
              borderRadius: 999,
              letterSpacing: 0.3
            }}
          >
            ADMIN
          </span>
        </div>

        <div style={{ padding: '18px 12px 8px' }}>
          <NavGroup tabs={[{ href: '/admin', label: 'Overview', icon: <OverviewIcon />, exact: true }]} activeStyle={activeStyle} inactiveStyle={inactiveStyle} />
          <NavGroup title="Catalog" tabs={CATALOG_TABS} activeStyle={activeStyle} inactiveStyle={inactiveStyle} />
          <NavGroup title="Operations" tabs={OPERATIONS_TABS} activeStyle={activeStyle} inactiveStyle={inactiveStyle} />
          <NavGroup title="Insights" tabs={ANALYTICS_TABS} activeStyle={activeStyle} inactiveStyle={inactiveStyle} />
          {isSuperAdmin && <NavGroup title="Admin" tabs={SUPER_ADMIN_TABS} activeStyle={activeStyle} inactiveStyle={inactiveStyle} />}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ padding: '14px 0 18px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
          <AdminUserCard name={session.user?.name} email={session.user?.email} />
        </div>
      </div>
      <div style={{ background: colors.appBgAdmin, padding: '36px 40px', overflow: 'auto' }}>{children}</div>
    </div>
  );
}
