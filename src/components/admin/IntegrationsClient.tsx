'use client';

import { useState } from 'react';
import { colors, fonts, radii, shadows } from '@/lib/theme';

interface IntegrationItem {
  id: string;
  platform: 'google' | 'bing' | 'facebook' | 'instagram' | 'x' | 'linkedin';
  pixelId: string;
  isActive: boolean;
}

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google Ads',
  facebook: 'Facebook Ads (Meta Pixel)',
  instagram: 'Instagram Ads',
  bing: 'Bing Ads (Microsoft Advertising)',
  x: 'X Ads (Twitter Pixel)',
  linkedin: 'LinkedIn Insight Tag'
};

const PLATFORM_DESCS: Record<string, string> = {
  google: 'Tracks Google Ads conversions and dynamic search campaigns. Format: AW-XXXXXXXXX.',
  facebook: 'The standard Meta Pixel for Facebook page view and standard checkout conversions.',
  instagram: 'Instagram retargeting. If sharing a Meta Pixel with Facebook, copy the same ID here.',
  bing: 'Microsoft UET Tag for tracking Search and Audience Ads conversions.',
  x: 'X/Twitter tracking pixel for conversion and audience collection.',
  linkedin: 'LinkedIn Insight Tag Partner ID for measuring professional audience campaign actions.'
};

export function IntegrationsClient({ initialData }: { initialData: IntegrationItem[] }) {
  const [items, setItems] = useState<IntegrationItem[]>(initialData);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const updateItemField = (platform: string, field: keyof IntegrationItem, value: any) => {
    setSuccess(false);
    setError('');
    setItems((prev) =>
      prev.map((item) => (item.platform === platform ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/admin/integrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      if (!res.ok) {
        throw new Error('Failed to save changes');
      }

      const updated = await res.json();
      setItems(updated);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 23, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>
          Marketing & Pixels
        </h1>
        <p style={{ fontSize: 13.5, color: colors.textMuted2, margin: '6px 0 0' }}>
          Configure conversion tracking pixels and analytics tags to measure and optimize your ad campaigns.
        </p>
      </div>

      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.xl,
          padding: 28,
          boxShadow: shadows.card,
          display: 'flex',
          flexDirection: 'column',
          gap: 24
        }}
      >
        {items.map((item) => (
          <div
            key={item.platform}
            style={{
              paddingBottom: 24,
              borderBottom: `1px solid ${colors.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <label style={{ fontSize: 14.5, fontWeight: 750, color: colors.text, display: 'block' }}>
                  {PLATFORM_LABELS[item.platform]}
                </label>
                <span style={{ fontSize: 12.5, color: colors.textFaint, marginTop: 4, display: 'block', maxWidth: 520 }}>
                  {PLATFORM_DESCS[item.platform]}
                </span>
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => updateItemField(item.platform, 'isActive', e.target.checked)}
                  style={{
                    width: 36,
                    height: 20,
                    appearance: 'none',
                    backgroundColor: item.isActive ? colors.primary : 'oklch(88% 0.01 85)',
                    borderRadius: 999,
                    position: 'relative',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    transform: item.isActive ? 'translateX(18px)' : 'translateX(4px)',
                    transition: 'transform 0.2s',
                    pointerEvents: 'none'
                  }}
                />
              </label>
            </div>

            {item.isActive && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted }}>
                  Pixel / Tag ID
                </span>
                <input
                  type="text"
                  value={item.pixelId}
                  onChange={(e) => updateItemField(item.platform, 'pixelId', e.target.value)}
                  placeholder={`Enter your ${PLATFORM_LABELS[item.platform]} ID`}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: radii.md,
                    border: `1px solid ${colors.borderStrong}`,
                    fontSize: 13.5,
                    outline: 'none',
                    background: '#fff',
                    color: colors.text,
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {error && (
          <div style={{ padding: '12px 16px', background: 'oklch(95% 0.02 20)', color: colors.danger, borderRadius: radii.md, fontSize: 13, fontWeight: 650 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'oklch(96% 0.02 145)', color: 'oklch(40% 0.12 145)', borderRadius: radii.md, fontSize: 13, fontWeight: 650 }}>
            ✓ Ad pixel configurations saved successfully.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn btn-interactive"
            style={{
              border: 'none',
              background: colors.primaryGradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: 13.5,
              padding: '12px 24px',
              borderRadius: radii.md,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 4px 12px oklch(58% 0.16 265 / 0.22)'
            }}
          >
            {saving ? 'Saving changes…' : 'Save Configurations'}
          </button>
        </div>
      </div>
    </div>
  );
}
