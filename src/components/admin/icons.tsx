function base(children: React.ReactNode) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function OverviewIcon() {
  return base(
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  );
}

export function WallArtIcon() {
  return base(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </>
  );
}

export function StockIcon() {
  return base(
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="2" y="2" width="14" height="14" rx="2" opacity="0.4" />
    </>
  );
}

export function TemplatesIcon() {
  return base(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  );
}

export function BundlesIcon() {
  return base(
    <>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>
  );
}

export function OrdersIcon() {
  return base(
    <>
      <path d="M6 2l1 4h10l1-4" />
      <rect x="4" y="6" width="16" height="15" rx="2" />
      <path d="M9 11a3 3 0 0 0 6 0" />
    </>
  );
}

export function CustomersIcon() {
  return base(
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.5a3.5 3.5 0 0 1 0 7" />
      <path d="M15 13.5c2.7 0 5.5 1.4 6.5 4.5" />
    </>
  );
}

export function AnalyticsIcon() {
  return base(
    <>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-6" />
    </>
  );
}

export function TeamIcon() {
  return base(
    <>
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </>
  );
}

export function AuditLogIcon() {
  return base(
    <>
      <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z" />
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M9 8h1" />
    </>
  );
}

export function LogoutIcon() {
  return base(
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  );
}

export function HomepageIcon() {
  return base(
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
      <path d="M9 20v-6h6v6" />
    </>
  );
}
