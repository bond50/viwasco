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

  return (
    <section className={cn('section', styles.about, 'default-background')}>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center g-5">
          {/* LEFT */}
          <div className="col-lg-6">
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
            </div>

            {/* ✅ At a glance (compact, content uses bootstrap grid inside) */}
            <div className={styles.glance} data-aos="fade-up" data-aos-delay="260">
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
            </div>

            {workingHours.length > 0 && (
              <div className={styles.workingHours} data-aos="fade-up" data-aos-delay="275">
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

            {socialLinks.length > 0 && (
              <div className={styles.socials} data-aos="fade-up" data-aos-delay="280">
                <h3 className={styles['mission-vision-header']}>Follow us</h3>
                <SocialLinks
                  links={socialLinks}
                  size="md"
                  ownerName={details.name}
                  className={styles.socialLinks}
                />
              </div>
            )}

            <div className={cn(styles['cta-wrapper'], 'mt-4')}>
              <Link
                href="/services"
                className={cn(styles.btn, styles['btn-secondary'])}
              >
                Our services
              </Link>

              <Link
                href="/about/leadership"
                className={cn(styles.btn, styles['btn-outline'])}
              >
                Meet our team
              </Link>
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

              {/* Mission / Vision */}
              <div
                className={styles['mission-vision']}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                {!!details.mission && (
                  <div className={styles.mission}>
                    <h3 className={styles['mission-vision-header']}>
                      Our Mission
                    </h3>
                    <p className={styles['mission-vision-paragraph']}>
                      {details.mission}
                    </p>
                  </div>
                )}

                {!!details.vision && (
                  <div className={styles.vision}>
                    <h3 className={styles['mission-vision-header']}>
                      Our Vision
                    </h3>
                    <p className={styles['mission-vision-paragraph']}>
                      {details.vision}
                    </p>
                  </div>
                )}
              </div>

              {/* ✅ Stats BELOW mission/vision */}
              {topMetrics.length > 0 && (
                <div
                  className={cn(styles['stats-container'], styles.statsBelowMV)}
                  data-aos="fade-up"
                  data-aos-delay="450"
                >
                  <div className="row g-3">
                    {topMetrics.map((m) => (
                      <div className="col-6 col-md-3" key={m.id}>
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
              )}
            </div>
          </div>
          {/* end right */}
        </div>
      </div>
    </section>
  );
}
