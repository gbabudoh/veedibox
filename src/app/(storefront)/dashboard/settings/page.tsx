import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/auth/requireAdmin';
import { prisma } from '@/lib/db/client';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { ROLE_LABEL } from '@/lib/product-mapper';
import { colors, fonts, radii, roleBadgeStyle } from '@/lib/theme';

export default async function DashboardSettingsPage() {
  const session = await requireSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  const cardStyle = { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.xl, padding: 24, marginBottom: 20 };

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 24, fontWeight: 800, margin: '0 0 20px' }}>Settings</h1>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <Avatar name={session.user?.name} email={session.user?.email} size={56} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{session.user?.name || 'Your profile'}</div>
            <div style={{ fontSize: 12.5, color: colors.textFaint }}>{session.user?.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Name</div>
            <Input value={session.user?.name ?? ''} readOnly />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Email</div>
            <Input value={session.user?.email ?? ''} readOnly />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 16 }}>Account</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${colors.borderSubtle}` }}>
            <span style={{ fontSize: 13, color: colors.textMuted }}>Account type</span>
            {user && <span style={roleBadgeStyle(ROLE_LABEL[user.role])}>{ROLE_LABEL[user.role]}</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0' }}>
            <span style={{ fontSize: 13, color: colors.textMuted }}>Member since</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              {user?.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) ?? '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
