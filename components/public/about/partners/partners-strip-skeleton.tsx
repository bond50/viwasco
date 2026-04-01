// components/public/about/partners/partners-strip-skeleton.tsx
import React from 'react';
import styles from './partners.module.css';
import { cn } from '@/lib/utils';

export function PartnersStripSkeleton() {
  return (
    <section className={cn('section', styles.partners)}>
      <div className="section-title">
        <div className="placeholder-glow mb-2" style={{ maxWidth: 160 }}>
          <span className="placeholder col-12 rounded" />
        </div>
        <div className="placeholder-glow" style={{ maxWidth: 360 }}>
          <span className="placeholder col-7 me-2" />
          <span className="placeholder col-4" />
        </div>
      </div>

      <div className={cn(styles['partners-slider'])}>
        <div className="d-flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="d-flex justify-content-center align-items-center"
              style={{
                height: 100,
                minWidth: 140,
                padding: 20,
                borderRight: i === 5 ? 'none' : '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <div
                className="placeholder-glow w-100"
                style={{ maxWidth: 100 }}
                aria-hidden="true"
              >
                <span
                  className="placeholder col-12 rounded"
                  style={{ height: 60, display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
