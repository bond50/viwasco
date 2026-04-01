import React from 'react';
import Link from 'next/link';
import styles from './breadcrumb.module.css';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  pageTitle?: string;
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, items }) => {
  // 🔹 Ignore any explicit "/" item to avoid Home duplication
  const filteredItems = items.filter((item) => item.href !== '/');

  const title =
    pageTitle ||
    filteredItems.find((x) => x.isActive)?.label ||
    filteredItems.at(-1)?.label ||
    'Home';

  return (
    <section className={cn(styles.pageTitle, 'light-background')}>
      <div
        className={cn(
          styles.container,
          'd-lg-flex',
          'container',
          'justify-content-between',
          'align-items-center',
        )}
      >
        <h1 className={styles.title}>{title}</h1>

        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            {/* Always show a single Home root */}
            <li>
              <Link href="/">Home</Link>
            </li>

            {filteredItems.map(({ label, href, isActive }) =>
              isActive ? (
                <li key={href} className={styles.current}>
                  {label}
                </li>
              ) : (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ),
            )}
          </ol>
        </nav>
      </div>
    </section>
  );
};
