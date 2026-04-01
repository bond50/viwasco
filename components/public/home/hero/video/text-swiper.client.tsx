'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Base hero layout (typography, content, kicker, title, subtitle)
import layout from '../hero-base.module.css';
// Swiper-specific styles
import styles from './text-swiper.module.css';

export type SwiperSlide = {
  id: string;
  kicker?: string | null;      // ← allow null
  heading: string;
  subheading?: string | null;  // ← allow null
};

type Props = {
  slides: SwiperSlide[];
  textStyleClassName: string;
  intervalMs?: number;
};

export const TextSwiper: React.FC<Props> = ({
  slides,
  textStyleClassName,
  intervalMs = 5000,
}) => {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <div className={styles.swiperRoot}>
      <div className={styles.swiperSlides}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              styles.swiperSlide,
              index === active
                ? styles.swiperSlideActive
                : styles.swiperSlideInactive,
            )}
          >
            <div className={cn(layout.content, textStyleClassName)}>
              {slide.kicker && <span className={layout.kicker}>{slide.kicker}</span>}
              <h1 className={layout.title}>{slide.heading}</h1>
              {slide.subheading && (
                <p className={layout.subtitle}>{slide.subheading}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className={styles.swiperDots}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={cn(
                styles.swiperDot,
                index === active && styles.swiperDotActive,
              )}
              onClick={() => setActive(index)}
              aria-label={`Show caption ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
