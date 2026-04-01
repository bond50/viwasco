'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FiFileText, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import styles from './newsletters.module.css';
import type { NewsletterCategory, NewsletterItem } from '@/lib/data/public/newsletters/getters';

function formatSize(sizeMb: number) {
  return `${sizeMb.toFixed(1)} MB`;
}

type Props = {
  items: NewsletterItem[];
  categories: NewsletterCategory[];
  activeCategory?: string;
  basePath: string;
  totalPages: number;
  page: number;
};

export function NewsletterList({ items, categories, activeCategory, basePath, totalPages, page }: Props) {
  const [active, setActive] = useState<NewsletterItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pageLinks = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  return (
    <>
      <div className={styles.newsHeader}>
        <div>
          <h2 className="mb-2">Newsletters</h2>
          <p className="text-muted mb-0">Monthly newsletters and community updates.</p>
        </div>
        <div className={styles.filterChips}>
          <Link href={basePath} className={cn(styles.chip, !activeCategory && styles.chipActive)}>
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${basePath}?category=${cat.slug}`}
              className={cn(styles.chip, activeCategory === cat.slug && styles.chipActive)}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemIcon}>
                <FiFileText />
              </div>
              <div className={styles.itemMeta}>
                <h4>{item.title}</h4>
                <p>{item.excerpt}</p>
              </div>
              <div className={styles.itemActions}>
                <button type="button" className={styles.previewButton} onClick={() => setActive(item)}>
                  Preview
                </button>
                <button
                  type="button"
                  className={styles.previewButton}
                  onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
                >
                  {expandedId === item.id ? 'Hide preview' : 'Show preview'}
                </button>
              </div>
              {expandedId === item.id && (
                <div className={styles.itemPreview}>
                  <iframe src={item.pdfUrl} title={`${item.title} preview`} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="alert alert-info mb-0">
            No newsletters have been published yet.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Link
            href={
              page > 1
                ? `${basePath}?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), page: String(page - 1) }).toString()}`
                : '#'
            }
            className={cn(styles.pageLink, page === 1 && styles.pageLinkDisabled)}
            aria-disabled={page === 1}
          >
            Previous
          </Link>

          <div className={styles.pageNumbers}>
            {pageLinks.map((n) => (
              <Link
                key={n}
                href={`${basePath}?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), page: String(n) }).toString()}`}
                className={cn(styles.pageNumber, n === page && styles.pageNumberActive)}
              >
                {n}
              </Link>
            ))}
          </div>

          <Link
            href={
              page < totalPages
                ? `${basePath}?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), page: String(page + 1) }).toString()}`
                : '#'
            }
            className={cn(styles.pageLink, page === totalPages && styles.pageLinkDisabled)}
            aria-disabled={page === totalPages}
          >
            Next
          </Link>
        </div>
      )}

      {active && (
        <div className={styles.modalBackdrop} onClick={() => setActive(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h4 className="mb-1">{active.title}</h4>
                <div className={styles.modalMeta}>
                  <span>Date added: {active.publishedAt || 'Draft'}</span>
                  <span>Downloads: {active.downloads.toLocaleString()}</span>
                  <span>Size: {formatSize(active.sizeMb)}</span>
                </div>
              </div>
              <button type="button" className={styles.previewButton} onClick={() => setActive(null)} aria-label="Close">
                <FiX />
              </button>
            </div>

            <div className={styles.previewFrame}>
              <iframe src={active.pdfUrl} title={`${active.title} preview`} className={styles.previewIframe} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
