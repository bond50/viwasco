// components/public/about/core-values/details.tsx
import React from 'react';
import styles from './core-value-detail.module.css';
import { cn } from '@/lib/utils';

import Image from 'next/image';
import { DynamicIcon } from '@/components/icons/DynamicIcon';
import type { UploadedImageResponse } from '@/lib/schemas/shared/image';

import { ensureUploadedImageStrict } from '@/lib/assets/core';
import { getMetrics, getOrganizationOverview, getValues } from '@/lib/data/public/about/getters';

type OrganizationValue = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  rank: number;
};

type PublicMetric = {
  label: string;
  value: string;
  icon: string | null;
};

type ViewProps = {
  coreValues: OrganizationValue[];
  coreValuesLeadText?: string | null;
  coreValuesImage?: UploadedImageResponse | null;
  metrics: PublicMetric[];
};

/**
 * PURE UI — no fetching here.
 * This is reused by the self-fetching server component below.
 */
function CoreValuesDetailView({
  coreValues,
  coreValuesLeadText,
  coreValuesImage,
  metrics,
}: ViewProps) {
  const img =
    coreValuesImage?.variants?.large?.secure_url ??
    coreValuesImage?.main?.secure_url ??
    coreValuesImage?.main?.url ??
    '/assets/img/featured-default.jpg';

  // First two metrics for floating chips (optional)
  const [m0, m1] = metrics;

  return (
    <section className={cn(styles['core__values-section'], 'default-background')}>
      <div className="container">
        <div className={styles['core__values-wrapper']}>
          <div className={styles['core__values-shapes']}>
            <div className={cn(styles['core__values-shape'], styles['shape-1'])} />
            <div className={cn(styles['core__values-shape'], styles['shape-2'])} />
            <div className={cn(styles['core__values-shape'], styles['shape-3'])} />
          </div>

          <div className="row align-items-stretch gy-0">
            {/* Left: values list */}
            <div className="col-lg-7">
              <div className={cn(styles['core__values-content'], 'p-5')}>
                <span className={styles['core__values-badge-custom']}>Core Values</span>

                <h2 className={cn('mt-5', 'mb-4', styles['core__values-content-title'])}>
                  Company Core Values
                </h2>

                {coreValuesLeadText && (
                  <p className={cn(styles['core__values-content-description'], 'mb-4')}>
                    {coreValuesLeadText}
                  </p>
                )}

                <div className={cn('row', styles['values-row'], 'mb-5')}>
                  {coreValues.map((value) => (
                    <div className="col-md-6" key={value.id}>
                      <div className={styles['values-row__item']}>
                        <div className={styles['values-row__icon']}>
                          <DynamicIcon iconKey={value.icon ?? undefined} size={24} />
                        </div>
                        <div className="values-row__content">
                          <h5 className={styles['values-row__title']}>{value.title}</h5>
                          <p className={styles['values-row__description']}>
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: image + floating metrics */}
            <div className="col-lg-5">
              <div className={styles['core__values-image-container']}>
                <div className={styles['image-wrapper']}>
                  <Image
                    src={img}
                    alt={coreValuesLeadText || 'Core values image'}
                    title={coreValuesLeadText || 'Core Values'}
                    fill
                    className={styles['core__values-image']}
                    sizes="(max-width: 992px) 100vw, 50vw"
                    quality={85}
                    priority
                  />
                </div>

                {m0 && (
                  <div className={cn(styles['floating-element'], styles['element-1'])}>
                    <DynamicIcon
                      iconKey={m0.icon ?? undefined}
                      size={18}
                      className={styles['floating-icon']}
                    />
                    <span>{`${m0.value} ${m0.label}`}</span>
                  </div>
                )}

                {m1 && (
                  <div className={cn(styles['floating-element'], styles['element-2'])}>
                    <DynamicIcon
                      iconKey={m1.icon ?? undefined}
                      size={18}
                      className={styles['floating-icon']}
                    />
                    <span>{`${m1.value} ${m1.label}`}</span>
                  </div>
                )}

                <div className={cn(styles['pattern-dots'])} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ✅ SELF-FETCHING SERVER COMPONENT
 * Use this anywhere with Suspense:
 *   <Suspense fallback={<CoreValuesDetailSkeleton />}>
 *     <CoreValuesDetail />
 *   </Suspense>
 */
export async function CoreValuesDetail() {
  const [org, values, metrics] = await Promise.all([
    getOrganizationOverview(),
    getValues(),
    getMetrics(),
  ]);

  if (!values || values.length === 0) return null;

  const coreValuesLeadText = org?.coreValuesLeadText ?? null;
  const coreValuesImage = org?.coreValuesImage
    ? ensureUploadedImageStrict(org.coreValuesImage)
    : null;

  const metricsUi: PublicMetric[] = metrics.map((m) => {
    const numeric =
      typeof m.value === 'number'
        ? m.value.toLocaleString('en-KE')
        : String(m.value);

    const valueWithUnit = m.unit ? `${numeric} ${m.unit}` : numeric;

    return {
      label: m.label,
      value: valueWithUnit,
      icon: m.icon ?? null,
    };
  });

  return (
    <CoreValuesDetailView
      coreValues={values}
      coreValuesLeadText={coreValuesLeadText}
      coreValuesImage={coreValuesImage}
      metrics={metricsUi}
    />
  );
}
