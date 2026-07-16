'use client';

import { useEffect, useState } from 'react';
import { PreviewTile } from '@/components/product/PreviewTile';
import { colors } from '@/lib/theme';

function ZoomIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

export function ProductGallery({ previewUrl, baseHue, title }: { previewUrl: string | null; baseHue: number; title: string }) {
  const thumbHues = [0, 1, 2, 3].map((i) => baseHue + i * 20);
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  return (
    <div data-protected="true">
      <button
        onClick={() => setLightboxOpen(true)}
        aria-label="Enlarge image"
        className="gallery-trigger"
        style={{ position: 'relative', display: 'block', width: '100%', padding: 0, border: 'none', background: 'none', cursor: 'zoom-in' }}
      >
        <PreviewTile previewUrl={previewUrl} hue={thumbHues[selected]} alt={title} containerStyle={{ height: 480, borderRadius: 20 }} />
        <span
          className="gallery-zoom-hint"
          style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.15s ease'
          }}
        >
          <ZoomIcon />
        </span>
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 12 }}>
        {thumbHues.map((hue, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={selected === i}
            style={{
              padding: 0,
              background: 'none',
              border: `2px solid ${selected === i ? colors.primary : 'transparent'}`,
              borderRadius: 10,
              cursor: 'pointer',
              opacity: selected === i ? 1 : 0.75,
              transition: 'opacity 0.15s ease, border-color 0.15s ease'
            }}
          >
            <PreviewTile previewUrl={previewUrl} hue={hue} alt="" containerStyle={{ height: 80, borderRadius: 8 }} />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,12,18,0.92)',
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            cursor: 'zoom-out',
            animation: 'fadeIn 0.15s ease'
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            style={{
              position: 'fixed',
              top: 22,
              right: 26,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          <div style={{ width: '100%', maxWidth: 1000, maxHeight: '85vh', aspectRatio: '4 / 3' }}>
            <PreviewTile previewUrl={previewUrl} hue={thumbHues[selected]} alt={title} containerStyle={{ height: '100%', borderRadius: 12 }} />
          </div>
        </div>
      )}
    </div>
  );
}
