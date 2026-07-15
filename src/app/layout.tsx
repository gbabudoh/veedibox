import type { Metadata } from 'next';
import { Manrope, Public_Sans } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-manrope' });
const publicSans = Public_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-public-sans' });

export const metadata: Metadata = {
  title: 'Veedibox — Modern art & creative assets',
  description: 'Digital paintings, stock imagery, and templates for decor, branding, and content.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${publicSans.variable}`}>
      <body style={{ fontFamily: 'var(--font-public-sans), system-ui, sans-serif', color: 'oklch(22% 0.02 265)' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
