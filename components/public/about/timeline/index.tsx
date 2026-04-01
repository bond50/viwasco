'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatDate, pickImageUrl } from '@/lib/public/media';
import styles from './timeline.module.css';

type Milestone = {
  id: string;
  year?: number | null;
  date?: string | Date | null;
  title: string;
  summary?: string | null;
  image?: unknown | null;
  rank?: number;
};

export function Timeline({ items }: { items: Milestone[] }) {
  const hasItems = items.length > 0;

  return (
    <section className={cn('section', 'default-background', styles.timelineSection)}>
      <div className="container">
        {/* Section title – same style pattern as others */}
        <div className="section-title" data-aos="fade-up" data-aos-delay="50">
          <h2>Milestones &amp; History</h2>
          <div>
            <span>Tracing our journey of </span>
            <span className="description-title">growth and service</span>
          </div>
        </div>

        {!hasItems ? (
          <div className={styles.emptyState}>
            <p>No milestones yet.</p>
          </div>
        ) : (
          <div className={styles.timeline}>
            <div className={styles.timelineLine} />

            {items.map((milestone, index) => {
              const img = pickImageUrl(milestone.image);
              const isEven = index % 2 === 0;

              return (
                <TimelineItem
                  key={milestone.id}
                  milestone={milestone}
                  img={img}
                  isEven={isEven}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineItem({
  milestone,
  img,
  isEven,
  index,
}: {
  milestone: Milestone;
  img: string | null;
  isEven: boolean;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = milestone.summary || '';
  const shouldTruncate = summary.length > 150; // character limit

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const displaySummary =
    shouldTruncate && !isExpanded ? `${summary.slice(0, 150)}...` : summary;

  return (
    <div
      id={`milestone-${milestone.id}`}
      className={cn(
        styles.timelineItem,
        isEven ? styles.left : styles.right,
      )}
      data-aos="fade-up"
      data-aos-delay={100 + index * 100}
    >
      <div className={styles.timelineDot} />

      <div className={styles.timelineContent}>
        {/* Year / Date */}
        <div className={styles.timelineDate}>
          {milestone.year && (
            <span className={styles.year}>{milestone.year}</span>
          )}
          {milestone.date && (
            <span className={styles.date}>
              {milestone.year && ' · '}
              {formatDate(milestone.date)}
            </span>
          )}
        </div>

        {/* Card */}
        <div className={styles.timelineCard}>
          {img && (
            <div className={styles.imageContainer}>
              <Image
                src={img}
                alt={milestone.title}
                width={400}
                height={250}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              />
            </div>
          )}

          <div className={styles.content}>
            <h3 className={styles.title}>{milestone.title}</h3>

            {summary && (
              <div className={styles.summaryContainer}>
                <p
                  className={cn(
                    styles.summary,
                    !isExpanded && styles.summaryTruncated,
                  )}
                >
                  {displaySummary}
                </p>

                {shouldTruncate && (
                  <button
                    onClick={toggleExpanded}
                    className={styles.toggleButton}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                    <span className={styles.toggleIcon}>
                      {isExpanded ? '↑' : '↓'}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
