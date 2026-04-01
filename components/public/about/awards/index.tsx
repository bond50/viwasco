// components/public/about/awards/index.tsx
import React from 'react';
import Image from 'next/image';
import styles from './awards.module.css';
import {
  type AssetJson,
  assetUrl,
  ensureUploadedAsset,
  isFileAsset,
  isImageAsset,
  type UploadedAsset,
} from '@/lib/assets/core';

export type Award = {
  id: string;
  title: string;
  issuer?: string | null;
  date?: Date | string | null;
  summary?: string | null;

  // Comes from Prisma.JsonValue → treat as unknown here and normalize
  badge?: unknown;

  linkUrl?: string | null;
  rank: number | null;
};

function formatDate(date: Award['date']): string | null {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return null;

  return d.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function resolveBadge(assetRaw: unknown): {
  href?: string;
  kind: 'image' | 'file' | null;
  single?: UploadedAsset;
} {
  const normalized: AssetJson = ensureUploadedAsset(assetRaw);
  if (!normalized) return { href: undefined, kind: null };

  const href = assetUrl(normalized);
  if (!href) return { href: undefined, kind: null };

  const single: UploadedAsset = Array.isArray(normalized)
    ? (normalized[0] as UploadedAsset)
    : (normalized as UploadedAsset);

  if (isImageAsset(single)) {
    return { href, kind: 'image', single };
  }

  if (isFileAsset(single)) {
    return { href, kind: 'file', single };
  }

  return { href, kind: null, single };
}

export function AwardsGrid({ items }: { items: Award[] }) {
  if (!items.length) return null;

  const ordered = [...items].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  return (
    <section className="section default-background">
      <div className="container" data-aos="fade-up" data-aos-delay={100}>
        <div className="row g-4">
          {ordered.map((a) => {
            const formattedDate = formatDate(a.date);
            const { href: badgeHref, kind: badgeKind } = resolveBadge(a.badge);

            return (
              <div className="col-12 col-md-6 col-lg-4" key={a.id}>
                <article className={styles.card}>
                  {badgeKind === 'image' && badgeHref && (
                    <div className={styles.badgePreview}>
                      <Image
                        src={badgeHref}
                        alt={`${a.title} badge`}
                        fill
                        className={styles.badgeImage}
                        sizes="120px"
                      />
                    </div>
                  )}

                  <h3 className={styles.title}>{a.title}</h3>

                  {(a.issuer || formattedDate) && (
                    <div className={styles.metaRow}>
                      {a.issuer && (
                        <span className={styles.issuer}>{a.issuer}</span>
                      )}
                      {formattedDate && (
                        <span className={styles.date}>{formattedDate}</span>
                      )}
                    </div>
                  )}

                  {a.summary && (
                    <p className={styles.desc}>{a.summary}</p>
                  )}

                  {(a.linkUrl || badgeHref) && (
                    <div className={styles.actions}>
                      {a.linkUrl && (
                        <a
                          href={a.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.actionLink}
                        >
                          Learn more
                        </a>
                      )}

                      {badgeHref && (
                        <a
                          href={badgeHref}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.actionLink}
                        >
                          {badgeKind === 'file'
                            ? 'Download badge'
                            : 'View badge'}
                        </a>
                      )}
                    </div>
                  )}
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
