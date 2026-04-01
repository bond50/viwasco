'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Base hero layout (typography, content, kicker, title, subtitle)
import layout from '../hero-base.module.css';
// Carousel-specific styles
import styles from './image-carousel.module.css';

export type ImageCarouselSlide = {
  id: string;
  kicker?: string | null;      // ← allow null
  heading: string;
  subheading?: string | null;  // ← allow null
}

type Props = {
  slides: ImageCarouselSlide[];
  textStyleClassName: string;
  intervalMs?: number;
};

export const ImageHeroCarousel: React.FC<Props> = ({
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
    <div className={styles.carouselRoot}>
      <div className={styles.carouselSlides}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              styles.carouselSlide,
              index === active
                ? styles.carouselSlideActive
                : styles.carouselSlideInactive,
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
        <div className={styles.carouselDots}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={cn(
                styles.carouselDot,
                index === active && styles.carouselDotActive,
              )}
              onClick={() => setActive(index)}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
