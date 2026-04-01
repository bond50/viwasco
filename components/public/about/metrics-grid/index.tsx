// components/public/about/metrics-grid.tsx
import React from 'react';
import styles from './metrics-grid.module.css';
import { cn } from '@/lib/utils';
import { InViewAnimatedCounter } from '@/components/common/in-view-animated-counter';
import { DynamicIcon } from '@/components/icons/DynamicIcon';
import { TbChartBar } from 'react-icons/tb';

type Metric = {
  id: string;
  label: string;
  value: number;
  unit?: string | null;
  icon?: string | null;
};

export function MetricsGrid({ items }: { items: Metric[] }) {
  if (!items.length) return <p>No metrics yet.</p>;

  return (
    <section className={cn('section', 'default-background')}>
      <div className="container">
        {/* Section title – styled like Mission & Vision */}
        <div className="section-title" data-aos="fade-up" data-aos-delay="50">
          <h2>Key Service Metrics</h2>
          <div>
            <span>Tracking our performance and </span>
            <span className="description-title">service delivery</span>
          </div>
        </div>

        <div className="row g-4 mt-4">
          {items.map((metric, index) => (
            <div key={metric.id} className="col-xl-3 col-lg-6 col-md-6">
              <div
                className={styles.metricCard}
                data-aos="flip-left"
                data-aos-delay={300 + index * 100}
              >
                {/* subtle pattern background */}
                <div className={styles.patternLayer} aria-hidden="true" />

                {/* actual content */}
                <div className={styles.metricContent}>
                  {/* Header: icon + animated value */}
                  <div className={styles.metricHeader}>
                    <div className={styles.metricIconWrapper}>
                      <DynamicIcon
                        iconKey={metric.icon ?? null}
                        size={28}
                        fallback={<TbChartBar aria-hidden />}
                        title={metric.label}
                      />
                    </div>

                    <div className={styles.metricValue}>
                      <InViewAnimatedCounter
                        value={metric.value}
                        hasPlus={false}
                        className="metric-value-text"
                      />
                    </div>
                  </div>

                  {/* Label + optional unit */}
                  <div className={styles.metricInfo}>
                    <h4>{metric.label}</h4>
                    {metric.unit && (
                      <p
                        className={cn(
                          'text-muted',
                          'small',
                          styles.metricUnit,
                        )}
                      >
                        {metric.unit}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
