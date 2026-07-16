import type { Metadata } from 'next';
import { Manrope, Public_Sans } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-manrope' });
const publicSans = Public_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-public-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Veedibox — Modern art & creative assets',
    template: '%s | Veedibox'
  },
  description: 'A curated marketplace for modern wall art prints, stock lifestyle imagery, and responsive templates. Curated like a gallery, delivered like a library.',
  keywords: ['digital art', 'wall art prints', 'stock photography', 'creative templates', 'design assets', 'UI wireframes', 'posters', 'bundles', 'curated visuals', 'local art design'],
  authors: [{ name: 'Veedibox Team' }],
  creator: 'Veedibox Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://veedibox.com',
    siteName: 'Veedibox',
    title: 'Veedibox — Modern art & creative assets',
    description: 'A curated marketplace for modern wall art prints, stock lifestyle imagery, and responsive templates.',
    images: [
      {
        url: 'https://veedibox.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Veedibox - Curated Visual Marketplace'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veedibox — Modern art & creative assets',
    description: 'A curated marketplace for modern wall art prints, stock lifestyle imagery, and responsive templates.',
    images: ['https://veedibox.com/og-image.jpg'],
    creator: '@veedibox'
  },
  other: {
    'geo.region': 'NG-LA',
    'geo.placename': 'Lagos',
    'geo.position': '6.5244;3.3792',
    'ICBM': '6.5244, 3.3792'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Veedibox',
    'url': 'https://veedibox.com',
    'logo': 'https://veedibox.com/logo.png',
    'description': 'A curated marketplace for modern art prints, stock lifestyle imagery, and responsive templates.',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Lagos',
      'addressRegion': 'LA',
      'addressCountry': 'NG'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '6.5244',
      'longitude': '3.3792'
    },
    'sameAs': [
      'https://twitter.com/veedibox',
      'https://github.com/veedibox'
    ]
  };

  return (
    <html lang="en" className={`${manrope.variable} ${publicSans.variable}`}>
      <body style={{ fontFamily: 'var(--font-public-sans), system-ui, sans-serif', color: 'oklch(22% 0.02 265)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>{children}</AuthProvider>
        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
