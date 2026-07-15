import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireSession } from '@/lib/auth/requireAdmin';
import { NavLink } from '@/components/ui/NavLink';
import { Avatar } from '@/components/ui/Avatar';
import { OverviewIcon, PurchasesIcon, DownloadsIcon, SettingsIcon, ArrowRightIcon, ArrowLeftIcon } from '@/components/dashboard/icons';
import { colors, maxWidth, radii, shadows } from '@/lib/theme';

const TABS = [
  { href: '/dashboard', label: 'Overview', icon: <OverviewIcon />, exact: true },
  { href: '/dashboard/purchases', label: 'Purchases', icon: <PurchasesIcon /> },
  { href: '/dashboard/downloads', label: 'Downloads', icon: <DownloadsIcon /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <SettingsIcon /> }
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  if (!session) redirect('/login');

  const activeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: colors.dark,
    color: '#fff',
    fontWeight: 700,
    fontSize: 13.5,
    padding: '10px 12px',
    borderRadius: radii.md,
    marginBottom: 3
  };
  const inactiveStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'transparent',
    color: colors.textMuted,
    fontWeight: 700,
    fontSize: 13.5,
    padding: '10px 12px',
    borderRadius: radii.md,
    marginBottom: 3
  };

  return (
    <div style={{ maxWidth: maxWidth.page, margin: '0 auto', padding: '24px 32px 96px' }}>
      <Link
        href="/"
        className="back-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13.5,
          fontWeight: 700,
          color: colors.textMuted,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.pill,
          padding: '9px 16px 9px 13px',
          boxShadow: shadows.card,
          marginBottom: 24
        }}
      >
        <ArrowLeftIcon />
        Back to main store
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: 32,
          alignItems: 'start',
          animation: 'fadeIn 0.35s ease'
        }}
      >
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 16, position: 'sticky', top: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 6px 16px' }}>
            <Avatar name={session.user?.name} email={session.user?.email} size={40} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.user?.name || 'Your account'}
              </div>
              <div style={{ fontSize: 11.5, color: colors.textFaint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.user?.email}
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 12 }}>
            {TABS.map((t) => (
              <NavLink key={t.href} href={t.href} exact={t.exact} activeStyle={activeStyle} inactiveStyle={inactiveStyle}>
                {t.icon}
                <span>{t.label}</span>
              </NavLink>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${colors.borderSubtle}`, marginTop: 10, paddingTop: 10 }}>
            <Link
              href="/shop/all"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 700,
                color: colors.primary,
                padding: '10px 12px',
                borderRadius: radii.md
              }}
            >
              <span>Browse the shop</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
