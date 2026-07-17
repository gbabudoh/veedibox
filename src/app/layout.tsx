import type { Metadata } from 'next';
import { Manrope, Public_Sans } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

import { prisma } from '@/lib/db/client';

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
  icons: {
    icon: '/favicon.png',
    apple: '/app-icon.png'
  },
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  let activeIntegrations: any[] = [];
  try {
    activeIntegrations = await prisma.$queryRaw<any[]>`SELECT * FROM "AdIntegration" WHERE "isActive" = true`;
  } catch (error) {
    // Graceful fallback if migrations haven't run or table is empty
  }

  const googleAd = activeIntegrations.find((x) => x.platform === 'google');
  const bingAd = activeIntegrations.find((x) => x.platform === 'bing');
  const facebookAd = activeIntegrations.find((x) => x.platform === 'facebook');
  const instagramAd = activeIntegrations.find((x) => x.platform === 'instagram'); // usually shares facebook pixel
  const xAd = activeIntegrations.find((x) => x.platform === 'x');
  const linkedinAd = activeIntegrations.find((x) => x.platform === 'linkedin');

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

        {/* Dynamic Ad Integrations */}
        {googleAd?.pixelId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAd.pixelId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAd.pixelId}');
              `}
            </Script>
          </>
        )}

        {facebookAd?.pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebookAd.pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {instagramAd?.pixelId && instagramAd.pixelId !== facebookAd?.pixelId && (
          <Script id="instagram-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${instagramAd.pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {bingAd?.pixelId && (
          <Script id="bing-pixel" strategy="afterInteractive">
            {`
              (function(w,d,t,r,u){var f,g,e;w[u]=w[u]||[],f=function(){var o={ti:"${bingAd.pixelId}"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},g=d.createElement(t),g.src=r,g.async=1,g.onload=g.onreadystatechange=function(){var s=this.readyState;s&&"loaded"!==s&&"complete"!==s||(f(),g.onload=g.onreadystatechange=null)},e=d.getElementsByTagName(t)[0],e.parentNode.insertBefore(g,e)})(window,document,"script","//bat.bing.com/bat.js","uetq");
            `}
          </Script>
        )}

        {xAd?.pixelId && (
          <Script id="x-pixel" strategy="afterInteractive">
            {`
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)
              },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
              twq('config','${xAd.pixelId}');
            `}
          </Script>
        )}

        {linkedinAd?.pixelId && (
          <Script id="linkedin-pixel" strategy="afterInteractive">
            {`
              _linkedin_partner_id = "${linkedinAd.pixelId}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);})(window.lintrk);
            `}
          </Script>
        )}

        {/* Existing Analytics */}
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
