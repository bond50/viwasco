'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type AdminBreadcrumbProps = {
  /** Optional page title; defaults to last segment or "Dashboard" */
  pageTitle?: string;
  /** Wrapper className if you need layout tweaks */
  className?: string;
  /** Admin base path (default "/admin"). Change if your root differs */
  baseHref?: string;
  /** Root label (default "Home") */
  homeLabel?: string;
  /** If true, convert segment labels to Title Case */
  titleCase?: boolean;
};

function toTitleCase(str: string): string {
  return str.replace(/\b\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

export function AdminBreadcrumb({
  pageTitle,
  className,
  baseHref = '/dashboard',
  homeLabel = 'Dashboard',
  titleCase = true,
}: AdminBreadcrumbProps) {
  const pathname = usePathname() || '/';
  const clean = pathname.split('?')[0].replace(/\/+$/, '');
  const base = baseHref.replace(/\/+$/, '');

  // Remove the admin base from the path when building crumbs
  const withinAdmin = clean.startsWith(base);
  const rawSegments = withinAdmin ? clean.slice(base.length) : clean;
  const segments = rawSegments.split('/').filter(Boolean);

  const items = segments.map((seg, i) => {
    const labelRaw = decodeURIComponent(seg.replace(/-/g, ' '));
    const label = titleCase ? toTitleCase(labelRaw) : labelRaw;
    const href = `${base}/${segments.slice(0, i + 1).join('/')}`.replace(/\/+$/, '') || base;
    const isActive = i === segments.length - 1;
    return { href, label, isActive };
  });

  const derivedTitle = items.at(-1)?.label || 'Dashboard';
  const title = pageTitle || derivedTitle;

  const showTrailingActive = items.length === 0; // When you're exactly at /admin

  return (
    <div className={cn('admin-page-title', className)}>
      <h1>{title}</h1>
      <nav aria-label="Breadcrumb">
        <ol className={cn('breadcrumb', 'admin-breadcrumb')}>
          <li className="breadcrumb-item">
            <Link href={base}>{homeLabel}</Link>
          </li>

          {items.map(({ href, label, isActive }) =>
            isActive ? (
              <li key={href} className="breadcrumb-item active" aria-current="page">
                {label}
              </li>
            ) : (
              <li key={href} className="breadcrumb-item">
                <Link href={href}>{label}</Link>
              </li>
            ),
          )}

          {showTrailingActive && (
            <li className="breadcrumb-item active" aria-current="page">
              {title}
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
}
