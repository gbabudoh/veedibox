'use client';

import { useState } from 'react';
import { ROLE_LABEL } from '@/lib/product-mapper';
import { TeamInviteModal } from '@/components/admin/TeamInviteModal';
import { TeamMemberActions } from '@/components/admin/TeamMemberActions';
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable';
import { Avatar } from '@/components/ui/Avatar';
import { colors, fonts, radii, roleBadgeStyle, statusBadgeStyle } from '@/lib/theme';

export interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

const COLUMNS = [
  { label: 'Name', width: '1.6fr' },
  { label: 'Role', width: '120px' },
  { label: 'Status', width: '100px' },
  { label: 'Actions', width: '1fr' }
];

export function TeamClient({ admins, currentUserId }: { admins: TeamMember[]; currentUserId: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>Team</h1>
          <div style={{ fontSize: 13, color: colors.textFaint, marginTop: 4 }}>{admins.length} admin account{admins.length === 1 ? '' : 's'}</div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="admin-btn"
          style={{ border: 'none', background: colors.primaryGradient, color: '#fff', fontWeight: 700, fontSize: 13.5, padding: '11px 18px', borderRadius: radii.md, cursor: 'pointer', boxShadow: '0 4px 12px oklch(58% 0.16 265 / 0.22)' }}
        >
          + Invite admin
        </button>
      </div>

      <AdminTable columns={COLUMNS}>
        {admins.map((a) => (
          <AdminTableRow key={a.id} columns={COLUMNS}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Avatar name={a.name} email={a.email} size={30} style={{ fontSize: 11 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name ?? '—'}</div>
                <div style={{ fontSize: 12, color: colors.textFaint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.email}</div>
              </div>
            </div>
            <div>
              <span style={roleBadgeStyle(ROLE_LABEL[a.role])}>{ROLE_LABEL[a.role]}</span>
            </div>
            <div>
              <span style={statusBadgeStyle(a.status === 'ACTIVE' ? 'Active' : 'Suspended')}>{a.status === 'ACTIVE' ? 'Active' : 'Suspended'}</span>
            </div>
            <div>
              <TeamMemberActions userId={a.id} role={a.role} status={a.status} isSelf={a.id === currentUserId} />
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>

      {showModal && <TeamInviteModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
