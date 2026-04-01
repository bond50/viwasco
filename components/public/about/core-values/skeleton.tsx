// components/public/about/core-values/skeleton.tsx
import React from 'react';
import styles from '@/components/public/about/core-values/details/core-value-detail.module.css';
import { cn } from '@/lib/utils';

export function CoreValuesDetailSkeleton() {
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
            {/* Left skeleton */}
            <div className="col-lg-7">
              <div className={cn(styles['core__values-content'], 'p-5')}>
                <div className="placeholder-glow mb-3" style={{ maxWidth: 150 }}>
                  <span className="placeholder col-12 rounded-pill" />
                </div>

                <div className="placeholder-glow mb-4" style={{ maxWidth: 320 }}>
                  <span className="placeholder col-12" />
                </div>

                <div className="placeholder-glow mb-4">
                  <span className="placeholder col-12" />
                  <span className="placeholder col-10" />
                </div>

                <div className="row g-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div className="col-md-6" key={i}>
                      <div className={styles['values-row__item']}>
                        <div className={styles['values-row__icon']}>
                          <span
                            className="placeholder rounded d-block"
                            style={{ width: 50, height: 50 }}
                          />
                        </div>

                        <div className="w-100">
                          <div className="placeholder-glow mb-2">
                            <span className="placeholder col-6" />
                          </div>
                          <div className="placeholder-glow">
                            <span className="placeholder col-11" />
                            <span className="placeholder col-9" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right skeleton */}
            <div className="col-lg-5">
              <div className={styles['core__values-image-container']}>
                <div className={styles['image-wrapper']}>
                  <div
                    className="placeholder-glow w-100 h-100 position-absolute top-0 start-0"
                    aria-hidden="true"
                  >
                    <span className="placeholder col-12 h-100 rounded-circle" />
                  </div>
                </div>

                {/* Floating chips placeholders */}
                <div className={cn(styles['floating-element'], styles['element-1'])}>
                  <div className="placeholder-glow">
                    <span className="placeholder col-8" />
                  </div>
                </div>

                <div className={cn(styles['floating-element'], styles['element-2'])}>
                  <div className="placeholder-glow">
                    <span className="placeholder col-8" />
                  </div>
                </div>

                <div className={cn(styles['pattern-dots'])} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
