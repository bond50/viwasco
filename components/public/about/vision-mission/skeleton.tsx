// components/public/about/vision-mission/skeleton.tsx
import React from 'react';
import styles from './vision-mission.module.css';
import { cn } from '@/lib/utils';

export function VisionMissionSkeleton() {
  return (
    <section className={cn('section', 'default-background', styles['vision-mission'])}>
      <div className="container">
        <div className="row">
          {Array.from({ length: 2 }).map((_, i) => (
            <div className="col-lg-6" key={i}>
              <div className={styles['mission-card']}>
                {/* icon circle */}
                <div className={styles['icon-box']}>
                  <span
                    className="placeholder rounded-circle d-block"
                    style={{ width: 28, height: 28 }}
                  />
                </div>

                {/* title */}
                <div className="placeholder-glow mb-3" style={{ maxWidth: 160, margin: '0 auto' }}>
                  <span className="placeholder col-12" />
                </div>

                {/* paragraph */}
                <div className="placeholder-glow">
                  <span className="placeholder col-11" />
                  <span className="placeholder col-10" />
                  <span className="placeholder col-9" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
