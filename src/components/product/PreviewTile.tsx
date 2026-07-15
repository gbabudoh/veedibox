import { CSSProperties } from 'react';
import { bgFor } from '@/lib/theme';

// Renders the real uploaded preview image (already resolved server-side into a plain URL)
// once a product has one, falling back to the deterministic gradient placeholder until then.
export function PreviewTile({
  previewUrl,
  hue,
  containerStyle,
  alt = ''
}: {
  previewUrl: string | null;
  hue: number;
  containerStyle?: CSSProperties;
  alt?: string;
}) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...containerStyle }}>
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, ...bgFor(hue) }} />
      )}
    </div>
  );
}
