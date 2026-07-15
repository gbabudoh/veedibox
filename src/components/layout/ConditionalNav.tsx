'use client';

import { usePathname } from 'next/navigation';
import { StorefrontNav } from '@/components/layout/StorefrontNav';

const NO_NAV_PREFIXES = ['/dashboard'];

export function ConditionalNav() {
  const pathname = usePathname();
  if (NO_NAV_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return <StorefrontNav />;
}
