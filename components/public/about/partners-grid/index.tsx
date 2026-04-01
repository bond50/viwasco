'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FiArrowRightCircle } from 'react-icons/fi';
import type { PartnershipType } from '@/lib/schemas/about/content/partners';
import type { UploadedImageResponse } from '@/lib/schemas/shared/image';
import styles from './partners-grid.module.css';

type PartnerCard = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo: UploadedImageResponse | null;
  partnershipType: PartnershipType;
};

type Props = {
  partners: PartnerCard[];
};

// Group headings (plural)
const PARTNER_TYPE_GROUP_LABELS: Record<PartnershipType, string> = {
  GOVERNMENT: 'Government partners',
  REGULATOR: 'Regulators',
  DONOR: 'Development partners',
  SUPPLIER: 'Suppliers',
  NGO: "NGOs’ partners",
  COMMUNITY: 'Community partners',
  OTHER: 'Other partners',
};

// Per-card label (singular, used inside details)
const PARTNER_TYPE_CARD_LABELS: Record<PartnershipType, string> = {
  GOVERNMENT: 'Government',
  REGULATOR: 'Regulator',
  DONOR: 'Development partner',
  SUPPLIER: 'Supplier',
  NGO: 'NGO partner',
  COMMUNITY: 'Community partner',
  OTHER: 'Other partner',
};

const TYPE_ORDER: PartnershipType[] = [
  'GOVERNMENT',
  'REGULATOR',
  'DONOR',
  'SUPPLIER',
  'NGO',
  'COMMUNITY',
  'OTHER',
];

function getHostname(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./i, '');
  } catch {
    return url;
  }
}

export function PartnersGrid({ partners }: Props) {
  if (!partners.length) return null;

  const grouped = partners.reduce<Record<PartnershipType, PartnerCard[]>>(
    (acc, p) => {
      const key = p.partnershipType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    },
    {
      GOVERNMENT: [],
      REGULATOR: [],
      DONOR: [],
      SUPPLIER: [],
      NGO: [],
      COMMUNITY: [],
      OTHER: [],
    },
  );

  const hasAnyGroup = TYPE_ORDER.some(
    (type) => grouped[type] && grouped[type].length > 0,
  );
  if (!hasAnyGroup) return null;

  return (
    <section className="section default-background">
      {/* Global section header */}
      <div className="container">
        <div className="section-title">
          <h2>Our Partners</h2>
          <div>
            <span>Organizations working with </span>
            <span className="description-title">VIWASCO</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.wrapper}>
          {TYPE_ORDER.map((type) => {
            const items = grouped[type];
            if (!items || items.length === 0) return null;

            const headingId = `partners-heading-${type.toLowerCase()}`;

            return (
              <div
                key={type}
                className={styles.group}
                role="group"
                aria-labelledby={headingId}
              >
                <div className={styles.groupBox}>
                  <div className={styles.groupHeader}>
                    <h2 id={headingId} className={styles.groupTitle}>
                      {PARTNER_TYPE_GROUP_LABELS[type]}
                    </h2>
                    <span className={styles.groupCount}>
                      {items.length}{' '}
                      {items.length === 1 ? 'partner' : 'partners'}
                    </span>
                  </div>

                  <div className={styles.groupBody}>
                    <div className="row g-3">
                      {items.map((p) => {
                        const hostname = getHostname(p.website);
                        const hasDescription =
                          Boolean(p.description && p.description.trim().length > 0);
                        const hasDetails =
                          hasDescription || Boolean(hostname);

                        return (
                          <div
                            key={p.id}
                            className="col-12 col-md-3"
                            id={`partner-${p.slug}`}
                          >
                            <PartnerCardComponent
                              partner={p}
                              hostname={hostname}
                              hasDescription={hasDescription}
                              hasDetails={hasDetails}
                              partnerTypeLabel={
                                PARTNER_TYPE_CARD_LABELS[p.partnershipType]
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type PartnerCardComponentProps = {
  partner: PartnerCard;
  hostname: string | null;
  hasDescription: boolean;
  hasDetails: boolean;
  partnerTypeLabel: string;
};

function PartnerCardComponent({
  partner: p,
  hostname,
  hasDescription,
  hasDetails,
  partnerTypeLabel,
}: PartnerCardComponentProps) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    if (!hasDetails) return;
    setShowDetails((prev) => !prev);
  };

  return (
    <article className={styles.card}>
      <div className={styles.cardInner}>
        {/* Logo / icon */}
        <div className={styles.itemIcon}>
          {p.logo ? (
            <div className={styles.logoWrap}>
              <Image
                src={p.logo.variants.small.secure_url}
                alt={p.name}
                fill
                className={styles.logoImage}
                sizes="(max-width: 768px) 80px, 100px"
              />
            </div>
          ) : (
            <div className={styles.logoFallback}>
              <span>{p.name}</span>
            </div>
          )}
        </div>

        {/* Compact content */}
        <div className={styles.itemContent}>
          <h3 className={styles.name}>{p.name}</h3>

          {/* Details block – hidden by default, only visible when arrow is clicked */}
          <div
            className={`${styles.details} ${
              showDetails && hasDetails ? styles.detailsExpanded : ''
            }`}
          >
            <div className={styles.detailsMeta}>
              <span className={styles.metaType}>{partnerTypeLabel}</span>

              {hostname && p.website && (
                <a
                  href={p.website}
                  className={styles.metaWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hostname}
                </a>
              )}
            </div>

            {hasDescription && (
              <p className={styles.description}>{p.description}</p>
            )}
          </div>
        </div>

        {/* Arrow – only render if there is something to reveal */}
        {hasDetails && (
          <div className={styles.itemArrow}>
            <button
              type="button"
              className={`${styles.itemArrowButton} ${
                showDetails ? styles.itemArrowButtonActive : ''
              }`}
              onClick={toggleDetails}
              aria-expanded={showDetails}
              aria-label={
                showDetails
                  ? `Hide details for ${p.name}`
                  : `Show details for ${p.name}`
              }
              title={
                showDetails
                  ? `Hide details for ${p.name}`
                  : `Show details for ${p.name}`
              }
            >
              <FiArrowRightCircle
                className={styles.itemArrowIcon}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
