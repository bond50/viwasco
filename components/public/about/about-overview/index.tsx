// components/public/about/about-overview/about.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import styles from '@/components/public/about/about-overview/about.module.css';
import Image from 'next/image';
import Link from 'next/link';

import { ensureUploadedImage, ensureUploadedImageStrict, pickBestVariant } from '@/lib/assets/core';
import { SocialLinks } from '@/components/reusables/social-links';

import { getMetrics, getOrganizationOverview } from '@/lib/data/public/about/getters';
import { parseWorkingHours, workingHoursTopbarLabel } from '@/lib/working-hours';
import { coerceJsonToRawLinks, processSocialLinks } from '@/lib/social-links';
import { formatCompactNumber } from '@/lib/format-number';


type PlatformOrganizationDetails = {
  name: string;
  tagline: string | null;
  introTitle: string | null;
  introDescription: string | null;
  vision: string | null;
  mission: string | null;
  visionIcon: string | null;
  missionIcon: string | null;
  introImage: ReturnType<typeof ensureUploadedImageStrict>;
  featuredImage: ReturnType<typeof ensureUploadedImageStrict>;
};

function buildLicenseSignal(regulatorName: string | null | undefined, hasLicense: boolean) {
  if (!hasLicense && !regulatorName) return null;

  const regulator = regulatorName?.trim();
  if (!regulator) return 'Licensed utility';

  if (/wasreb|water services regulatory board/i.test(regulator)) {
    return 'WASREB licensed';
  }

  return `${regulator} licensed`;
}

function buildServiceAreaSignal(values: Array<string | null | undefined>) {
  const combined = values.filter(Boolean).join(' ').toLowerCase();
  if (combined.includes('vihiga')) return 'Serving Vihiga County';
  return values.some(Boolean) ? 'County-wide service' : null;
}

export async function AboutOverviewSection() {
  const [org, metrics] = await Promise.all([
    getOrganizationOverview(),
    getMetrics(),
  ]);

  if (!org) return null;

  // featured is required; intro may be missing → fallback to featured
  const featuredImage = ensureUploadedImageStrict(org.featuredImage);
  const introImage = ensureUploadedImage(org.introImage) ?? featuredImage;

  const details: PlatformOrganizationDetails = {
    name: org.name,
    tagline: org.tagline ?? null,
    introTitle: org.introTitle ?? null,
    introDescription: org.introDescription ?? null,
    vision: org.vision ?? null,
    mission: org.mission ?? null,
    visionIcon: org.visionIcon ?? null,
    missionIcon: org.missionIcon ?? null,
    introImage,
    featuredImage,
  };

  const best = pickBestVariant(details.introImage, [
    'square',
    'medium',
    'small',
    'thumb',
  ]);
  const bestUrl = best.secure_url || best.url;
  const workingHoursLabel = workingHoursTopbarLabel(org?.workingHours);
  const workingHours = parseWorkingHours(org.workingHours);
  const socialLinks = processSocialLinks(coerceJsonToRawLinks(org.socialLinks));


  const topMetrics = metrics.slice(0, 4);
  const trustSignals = [
    buildLicenseSignal(org.regulatorName, Boolean(org.licenseNumber || org.licenseExpiry)),
    org.customerCareHotline
      ? 'Customer care hotline'
      : org.whatsappNumber
        ? 'WhatsApp support'
        : org.contactEmail
          ? 'Email support'
          : null,
    buildServiceAreaSignal([
      org.address,
      org.name,
      org.tagline,
      org.introTitle,
      org.introDescription,
    ]),
  ].filter(Boolean) as string[];

  return (
    <section className={cn('section', styles.about, 'default-background')}>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center g-5">
          {/* LEFT */}
          <div className="col-lg-6">
            <div className={styles.primaryContent}>
              <div
                className={styles['about-content']}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h3 className={styles['about-content-subtitle']}>
                  {`About ${details.name}`}
                </h3>

                {details.introTitle && (
                  <h2 className={styles['about-content-h2']}>
                    {details.introTitle}
                  </h2>
                )}

                {details.tagline && (
                  <p className={styles.lead}>{details.tagline}</p>
                )}

                {details.introDescription && (
                  <p className={styles['about-content-paragraph']}>
                    {details.introDescription}
                  </p>
                )}

                {trustSignals.length > 0 && (
                  <ul className={styles.trustSignals}>
                    {trustSignals.map((signal) => (
                      <li key={signal} className={styles.trustSignal}>
                        {signal}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.ctaGroup} data-aos="fade-up" data-aos-delay="240">
                <div className={styles['cta-wrapper']}>
                  <Link
                    href="/services"
                    className={cn(styles.btn, styles['btn-secondary'])}
                  >
                    Our services
                  </Link>

                  <Link
                    href="/contact"
                    className={cn(styles.btn, styles['btn-outline'])}
                  >
                    Contact us
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.secondaryContent}>
              <div className={styles.secondaryHeader} data-aos="fade-up" data-aos-delay="250">
                Operational information
              </div>

              {/* ✅ At a glance (compact, content uses bootstrap grid inside) */}
              <div className={cn(styles.glance, styles.surfacePanel)} data-aos="fade-up" data-aos-delay="260">
                <h3 className={styles['mission-vision-header']}>At a glance</h3>

                <ul className={styles.glanceList}>
                  {org.regulatorName && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>Regulator</span>
                      <span className={styles.glanceValue}>{org.regulatorName}</span>
                    </li>
                  )}

                  {(org.licenseNumber || org.licenseExpiry) && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>License</span>
                      <span className={styles.glanceValue}>
                        {org.licenseNumber && <>{org.licenseNumber}</>}
                        {org.licenseNumber && org.licenseExpiry && ' · '}
                        {org.licenseExpiry && (
                          <>
                            Expires{' '}
                            {new Date(org.licenseExpiry).toLocaleDateString('en-KE', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                            })}
                          </>
                        )}
                      </span>
                    </li>
                  )}

                  {workingHoursLabel && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>Working hours</span>
                      <span className={styles.glanceValue}>{workingHoursLabel}</span>
                    </li>
                  )}

                  {org.customerCareHotline && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>Customer care</span>
                      <span className={styles.glanceValue}>{org.customerCareHotline}</span>
                    </li>
                  )}

                  {org.whatsappNumber && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>WhatsApp</span>
                      <span className={styles.glanceValue}>{org.whatsappNumber}</span>
                    </li>
                  )}

                  {org.phone && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>Phone</span>
                      <span className={styles.glanceValue}>{org.phone}</span>
                    </li>
                  )}

                  {org.contactEmail && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>Email</span>
                      <a href={`mailto:${org.contactEmail}`} className={styles.glanceLink}>
                        {org.contactEmail}
                      </a>
                    </li>
                  )}

                  {org.websiteUrl && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>Website</span>
                      <a
                        href={org.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.glanceLink}
                      >
                        {org.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </li>
                  )}

                  {org.address && (
                    <li className={cn(styles.glanceItem)}>
                      <span className={styles.glanceLabel}>Address</span>
                      <span className={styles.glanceValue}>{org.address}</span>
                    </li>
                  )}
                </ul>

                {workingHours.length > 0 && (
                  <div className={styles.glanceSubsection}>
                    <h3 className={styles['mission-vision-header']}>Working hours</h3>
                    <ul className={styles.workingHoursList}>
                      {workingHours.map((item) => (
                        <li key={`${item.days}-${item.hours}`} className={styles.workingHoursItem}>
                          <span className={styles.workingHoursDays}>{item.days}</span>
                          <span className={styles.workingHoursValue}>{item.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className={styles.socials} data-aos="fade-up" data-aos-delay="280">
                  <h3 className={styles['mission-vision-header']}>Follow us</h3>
                  <p className={styles.socialsCue}>Get updates and service notices.</p>
                  <SocialLinks
                    links={socialLinks}
                    size="md"
                    ownerName={details.name}
                    className={styles.socialLinks}
                  />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-6">
            <div
              className={styles['about-image-wrapper']}
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div className={styles['about-image-container']}>
                {bestUrl && (
                  <Image
                    src={bestUrl}
                    alt={`About ${details.name}${
                      details.introTitle ? ` - ${details.introTitle}` : ''
                    }`}
                    title={`About ${details.name}`}
                    fill
                    className="img-fluid rounded"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                )}
              </div>

              <div className={styles.imageCaption}>
                <span className={styles.imageCaptionTitle}>{details.name}</span>
                {org.address && (
                  <span className={styles.imageCaptionMeta}>{org.address}</span>
                )}
              </div>

              {/* Mission / Vision */}
              <div
                className={styles['mission-vision']}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                {!!details.mission && (
                  <div className={cn(styles.mission, styles.surfacePanel)}>
                    <h3 className={styles['mission-vision-header']}>
                      Our Mission
                    </h3>
                    <p className={styles['mission-vision-paragraph']}>
                      {details.mission}
                    </p>
                  </div>
                )}

                {!!details.vision && (
                  <div className={cn(styles.vision, styles.surfacePanel)}>
                    <h3 className={styles['mission-vision-header']}>
                      Our Vision
                    </h3>
                    <p className={styles['mission-vision-paragraph']}>
                      {details.vision}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* end right */}
        </div>

        {topMetrics.length > 0 && (
          <div className={styles.statsTransition} data-aos="fade-up" data-aos-delay="430">
            <div className={styles.statsLead}>
              <span className={styles.statsLeadEyebrow}>Overview snapshot</span>
              <p className={styles.statsLeadText}>A quick look at the organization in numbers.</p>
            </div>

            <div
              className={cn(styles['stats-container'], styles.statsFullWidth)}
              data-aos="fade-up"
              data-aos-delay="450"
            >
              <div className={styles.statsHeader}>Key figures</div>
              <div className={cn('row g-3', styles.statsRow)}>
                {topMetrics.map((m) => (
                  <div className={cn('col-6 col-lg-3', styles.statsGridCell)} key={m.id}>
                    <div className={styles['stat-item']}>
                      <div className={styles['stat-item__number']}>
                        {formatCompactNumber(m.value)}
                        {m.unit ? <span className="ms-1">{m.unit}</span> : null}
                      </div>
                      <div className={styles['stat-item__label']}>
                        {m.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
