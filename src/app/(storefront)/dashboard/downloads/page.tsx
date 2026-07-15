import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireSession } from '@/lib/auth/requireAdmin';
import { getUserDownloads } from '@/lib/dashboard-data';
import { hueFromId, LICENSE_TO_UI, LICENSE_META } from '@/lib/product-mapper';
import { resolvePreviewUrl } from '@/lib/product-preview';
import { colors, fonts, radii } from '@/lib/theme';
import { PreviewTile } from '@/components/product/PreviewTile';

function daysLeft(expiresAt: Date): number {
  return Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default async function DashboardDownloadsPage() {
  const session = await requireSession();
  if (!session) redirect('/login');

  const myDownloads = await getUserDownloads((session.user as any).id);
  const now = new Date();
  const activeCount = myDownloads.filter((d) => d.token.expiresAt > now).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 24, fontWeight: 800, margin: 0 }}>Downloads</h1>
        <span style={{ fontSize: 13, color: colors.textFaint }}>{activeCount} of {myDownloads.length} active</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {myDownloads.map(({ item, file, token }) => {
          const expired = token.expiresAt < now;
          const left = daysLeft(token.expiresAt);
          return (
            <div
              key={token.id}
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: radii.xl,
                overflow: 'hidden',
                background: colors.surface,
                opacity: expired ? 0.6 : 1
              }}
            >
              <PreviewTile previewUrl={resolvePreviewUrl(item.product.previewKey)} hue={hueFromId(item.product.id)} alt={item.product.title} containerStyle={{ height: 130 }} />
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 2 }}>{item.product.title}</div>
                <div style={{ fontSize: 11.5, color: colors.textFaint, marginBottom: 8 }}>{file.label} · {file.fileSizeMb} MB</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11.5, color: colors.textFaint }}>Licence: {LICENSE_META[LICENSE_TO_UI[item.license]].label}</span>
                  {!expired && (
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: left <= 5 ? colors.warn : colors.textFaint }}>
                      {left <= 0 ? 'expires today' : `${left}d left`}
                    </span>
                  )}
                </div>
                {expired ? (
                  <div style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center', fontSize: 12.5, color: colors.textFaint, padding: 9, border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.sm }}>
                    Link expired
                  </div>
                ) : (
                  <a
                    href={`/api/downloads/${token.token}`}
                    style={{ display: 'block', width: '100%', boxSizing: 'border-box', textAlign: 'center', border: 'none', background: colors.dark, color: '#fff', fontWeight: 700, fontSize: 12.5, padding: 9, borderRadius: radii.sm, cursor: 'pointer' }}
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          );
        })}
        {myDownloads.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '56px 18px', border: `1px solid ${colors.border}`, borderRadius: radii.xl, background: colors.surface }}>
            <div style={{ fontSize: 14, color: colors.textFaint, marginBottom: 14 }}>No downloads yet — files appear here once a purchase is complete.</div>
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
