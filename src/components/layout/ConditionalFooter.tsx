'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';

const NO_FOOTER_EXACT = ['/login', '/register'];
const NO_FOOTER_PREFIXES = ['/dashboard'];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (NO_FOOTER_EXACT.includes(pathname)) return null;
  if (NO_FOOTER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return <Footer />;
}
