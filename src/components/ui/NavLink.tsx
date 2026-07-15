'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CSSProperties, ReactNode } from 'react';

export function NavLink({
  href,
  children,
  activeStyle,
  inactiveStyle,
  exact = false,
  className
}: {
  href: string;
  children: ReactNode;
  activeStyle: CSSProperties;
  inactiveStyle: CSSProperties;
  exact?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={className} style={{ cursor: 'pointer', ...(active ? activeStyle : inactiveStyle) }}>
      {children}
    </Link>
  );
}
