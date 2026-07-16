'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CSSProperties, ReactNode, useState } from 'react';

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
  const [hovered, setHovered] = useState(false);

  const hoverOverlay: CSSProperties = hovered && !active ? {
    background: 'oklch(96% 0.008 85)',
    color: 'oklch(22% 0.02 265)',
    transition: 'all 0.15s ease'
  } : {
    transition: 'all 0.15s ease'
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        ...(active ? activeStyle : inactiveStyle),
        ...hoverOverlay
      }}
    >
      {children}
    </Link>
  );
}
