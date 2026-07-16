import { CSSProperties } from 'react';
import { bgFor } from '@/lib/theme';

// Renders the real uploaded preview image (already resolved server-side into a plain URL)
// once a product has one, falling back to the deterministic gradient placeholder until then.
export function PreviewTile({
  previewUrl,
  hue,
  containerStyle,
  alt = '',
  hovered = false
}: {
  previewUrl: string | null;
  hue: number;
  containerStyle?: CSSProperties;
  alt?: string;
  hovered?: boolean;
}) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...containerStyle }}>
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={alt}
          draggable={false}
          data-protected="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            ...bgFor(hue),
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      )}
    </div>
  );
}
