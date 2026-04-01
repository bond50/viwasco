// components/public/about/cert-list.tsx
import React from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import styles from './cert-list.module.css';
import {
  type AssetJson,
  assetUrl,
  ensureUploadedAsset,
  isFileAsset,
  isImageAsset,
  type UploadedAsset,
} from '@/lib/assets/core';

export type Certification = {
  id: string;
  name: string;
  issuingAuthority?: string | null;
  issueDate?: Date | string | null;
  expiryDate?: Date | string | null;

  // Prisma.JsonValue from DB → treat as unknown here
  certificateFile?: unknown;

  rank: number | null;
};

function formatDate(d: Certification['issueDate']): string | null {
  if (!d) return null;
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function resolveCertificate(assetRaw: unknown): {
  href?: string;
  label?: string;
} {
  const normalized: AssetJson = ensureUploadedAsset(assetRaw);
  if (!normalized) return {};

  const href = assetUrl(normalized);
  if (!href) return {};

  const single: UploadedAsset = Array.isArray(normalized)
    ? (normalized[0] as UploadedAsset)
    : (normalized as UploadedAsset);

  if (isFileAsset(single)) {
    return {
      href,
      label: single.original_filename || 'Certificate file',
    };
  }

  if (isImageAsset(single)) {
    // we don't expect images here, but handle gracefully
    return {
      href,
      label: 'Certificate image',
    };
  }

  return { href, label: 'Certificate file' };
}

export function CertsList({ items }: { items: Certification[] }) {
  if (!items.length) {
    return <p className="text-muted">No certifications available at the moment.</p>;
  }

  const ordered = [...items].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  return (
    <section className="section default-background">
      <div className="container">
        <div className="row g-3">
          {ordered.map((c) => {
            const issue = formatDate(c.issueDate);
            const expiry = formatDate(c.expiryDate);
            const { href, label } = resolveCertificate(c.certificateFile);

            return (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={c.id}
              >
                <article className={styles.item}>
                  <div className={styles.iconCol}>
                    <span className={styles.iconCircle} aria-hidden="true">
                      <FiFileText className={styles.icon} />
                    </span>
                  </div>

                  <div className={styles.contentCol}>
                    <h2 className={styles.name}>{c.name}</h2>

                    {(c.issuingAuthority || issue || expiry) && (
                      <div className={styles.metaRow}>
                        {c.issuingAuthority && (
                          <span className={styles.metaBadge}>
                            {c.issuingAuthority}
                          </span>
                        )}

                        {issue && !expiry && (
                          <span className={styles.metaText}>Issued {issue}</span>
                        )}

                        {issue && expiry && (
                          <span className={styles.metaText}>
                            Issued {issue} · Expires {expiry}
                          </span>
                        )}

                        {!issue && expiry && (
                          <span className={styles.metaText}>Expires {expiry}</span>
                        )}
                      </div>
                    )}

                    {href && (
                      <div className={styles.actions}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.downloadLink}
                        >
                          <FiDownload
                            className={styles.downloadIcon}
                            aria-hidden="true"
                          />
                          <span>{label ?? 'Download certificate'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
