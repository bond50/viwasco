// components/public/about/testimonials/skeleton.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import styles from './testimonials.module.css';

/** Reusable QuoteCard-like skeleton */
function QuoteCardSkeleton() {
  return (
    <div className={cn(styles.skelCard, 'placeholder-glow')}>
      <div className={styles.skelHeader}>
        <span
          className="placeholder rounded-circle"
          style={{ width: 56, height: 56 }}
        />
        <div className="flex-grow-1 ms-3">
          <span className="placeholder col-7 d-block mb-2" />
          <span className="placeholder col-5 d-block" />
        </div>
      </div>

      <div className={styles.skelBody}>
        <span className="placeholder col-12 d-block mb-2" />
        <span className="placeholder col-11 d-block mb-2" />
        <span className="placeholder col-9 d-block" />
      </div>
    </div>
  );
}

/** Full testimonials page (grid) skeleton */
export function TestimonialsGridSkeleton() {
  return (
    <div className="row g-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="col-12 col-md-6 col-xl-4">
          <QuoteCardSkeleton />
        </div>
      ))}
    </div>
  );
}

/** About-page strip skeleton (3 cards, like the swiper strip) */
export function TestimonialsStripSkeleton() {
  return (
    <section className={cn('section', 'default-background', styles.testimonials)}>
      <div className="container">
        {/* Title skeleton */}
        <div className="section-title text-center mb-4">
          <div className="placeholder-glow">
            <span className="placeholder col-3 d-block mx-auto mb-2" />
            <span className="placeholder col-6 d-block mx-auto" />
          </div>
        </div>

        {/* 3-card row to mimic strip */}
        <div className={cn(styles.slider, styles.skelSlider)}>
          <div className="row g-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="col-12 col-md-4" key={i}>
                <QuoteCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
