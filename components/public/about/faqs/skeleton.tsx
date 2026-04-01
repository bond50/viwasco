// components/public/about/faqs/skeleton.tsx
import React from 'react';
import styles from './faqs.module.css';
import { cn } from '@/lib/utils';

export function FaqsSkeleton() {
  return (
    <section className={cn('section', 'default-background')}>
      <div className="container">
        <div className={styles.accordion}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.header} aria-hidden>
                <div className="placeholder-glow w-100 d-flex justify-content-between align-items-center">
                  <span className="placeholder col-9" />
                  <span className="placeholder col-1" />
                </div>
              </div>

              {/* one expanded-ish body to suggest content */}
              {i === 0 && (
                <div className={styles.body}>
                  <div className="placeholder-glow">
                    <span className="placeholder col-11" />
                    <span className="placeholder col-10" />
                    <span className="placeholder col-8" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
