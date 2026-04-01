// components/public/about/about-overview/about-skeleton.tsx
import React from 'react';
import styles from '@/components/public/about/about-overview/about.module.css';
import { cn } from '@/lib/utils';

export function AboutOverviewSkeleton() {
  return (
    <section className={cn('section', styles.about, 'default-background')}>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left side skeleton */}
          <div className="col-lg-6">
            {/* Intro skeleton */}
            <div className={styles['about-content']}>
              <div className="placeholder-glow mb-3" style={{ maxWidth: 180 }}>
                <span className="placeholder col-12 rounded" />
              </div>

              <div className="placeholder-glow mb-2">
                <span className="placeholder col-9" />
              </div>

              <div className="placeholder-glow mb-4">
                <span className="placeholder col-7" />
              </div>

              <div className="placeholder-glow">
                <span className="placeholder col-12" />
                <span className="placeholder col-11" />
                <span className="placeholder col-10" />
              </div>
            </div>

            {/* At a glance skeleton */}
            <div className={styles.glance}>
              <div className="placeholder-glow mb-3" style={{ maxWidth: 140 }}>
                <span className="placeholder col-12" />
              </div>

              <ul className={cn(styles.glanceList, 'row g-2')}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <li
                    key={i}
                    className={cn(
                      styles.glanceItem,
                      i < 2 ? 'col-12' : 'col-6'
                    )}
                  >
                    <div className="placeholder-glow w-100">
                      <span className="placeholder col-5 me-2" />
                      <span className="placeholder col-6" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA skeleton */}
            <div
              className={styles['cta-wrapper']}
              style={{ marginTop: '1.5rem' }}
            >
              <div className="placeholder-glow" style={{ width: 160 }}>
                <span
                  className="placeholder col-12 rounded-pill"
                  style={{ height: 44, display: 'block' }}
                />
              </div>

              <div className="placeholder-glow" style={{ width: 160 }}>
                <span
                  className="placeholder col-12 rounded-pill"
                  style={{ height: 44, display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* Right side skeleton */}
          <div className="col-lg-6">
            <div className={styles['about-image-wrapper']}>
              <div className={styles['about-image-container']}>
                <div
                  className="placeholder-glow w-100 h-100 position-absolute top-0 start-0"
                  aria-hidden="true"
                >
                  <span className="placeholder col-12 h-100 rounded" />
                </div>
              </div>

              {/* Mission/Vision skeleton */}
              <div className={styles['mission-vision']}>
                <div className={styles.mission}>
                  <div className="placeholder-glow mb-2">
                    <span className="placeholder col-6" />
                  </div>
                  <div className="placeholder-glow">
                    <span className="placeholder col-12" />
                    <span className="placeholder col-10" />
                  </div>
                </div>

                <div className={styles.vision}>
                  <div className="placeholder-glow mb-2">
                    <span className="placeholder col-6" />
                  </div>
                  <div className="placeholder-glow">
                    <span className="placeholder col-12" />
                    <span className="placeholder col-10" />
                  </div>
                </div>
              </div>

              {/* ✅ Stats skeleton BELOW mission/vision */}
              <div className={cn(styles['stats-container'], styles.statsBelowMV)}>
                <div className="row g-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div className="col-6 col-md-3" key={i}>
                      <div className={styles['stat-item']}>
                        <div className="placeholder-glow mb-2">
                          <span className="placeholder col-8" />
                        </div>
                        <div className="placeholder-glow">
                          <span className="placeholder col-10" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* end stats */}
            </div>
          </div>
          {/* end right */}
        </div>
      </div>
    </section>
  );
}
