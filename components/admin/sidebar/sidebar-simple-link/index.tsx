// components/admin/sidebar/sidebar-simple-link.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarSimpleLinkProps = {
  href: string;
  iconClass: string;
  label: string;
  /** set true for exact match (e.g. /dashboard) */
  exact?: boolean;
  /** open external URLs in a new tab (default true) */
  newTabExternal?: boolean;
};

function isExternalUrl(href: string) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}
function normalizePath(p: string) {
  // strip trailing slash except for root
  if (!p) return '/';
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
}

export function SidebarSimpleLink({
  href,
  iconClass,
  label,
  exact = false,
  newTabExternal = true,
}: SidebarSimpleLinkProps) {
  const pathname = normalizePath(usePathname() || '/');
  const target = normalizePath(href);
  const external = isExternalUrl(href);

  const isActive = exact
    ? pathname === target
    : pathname === target || pathname.startsWith(`${target}/`);
  // NiceAdmin styling: active -> "nav-link"; inactive -> "nav-link collapsed"
  const linkClass = isActive ? 'nav-link' : 'nav-link collapsed';

  const content = (
    <>
      <i className={iconClass} />
      <span>{label}</span>
    </>
  );

  return (
    <li className="nav-item">
      {external ? (
        <a
          className={linkClass}
          href={href}
          {...(newTabExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          aria-current={isActive ? 'page' : undefined}
        >
          {content}
        </a>
      ) : (
        <Link href={href} className={linkClass} aria-current={isActive ? 'page' : undefined}>
          {content}
        </Link>
      )}
    </li>
  );
}
