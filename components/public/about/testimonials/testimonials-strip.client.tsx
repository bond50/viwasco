// components/public/about/testimonials/testimonials-strip.client.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/pagination';

import { QuoteCard } from '@/components/public/about/quote-card';
import { pickImageUrl } from '@/lib/public/media';
import styles from './testimonials.module.css';
import { cn } from '@/lib/utils';

type Testimonial = {
  id: string;
  authorName: string;
  authorRole?: string | null;
  message: string;
  avatar?: unknown | null;
};

type Props = {
  items: Testimonial[];
};

export function TestimonialsStripClient({ items }: Props) {
  if (!items.length) return null;

  const swiperConfig: SwiperOptions = {
    loop: true,
    speed: 900,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: { clickable: true },
    slidesPerView: 1,
    spaceBetween: 18,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 18 },
      992: { slidesPerView: 3, spaceBetween: 22 },
      1200: { slidesPerView: 3, spaceBetween: 26 },
    },
  };

  return (
    <section className={cn('section', 'default-background', styles.testimonials)}>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {/*<div className="section-title text-center mb-4">*/}
        {/*  <h2>Testimonials</h2>*/}
        {/*  <p className="text-muted mb-0">*/}
        {/*    What customers and partners say about our service delivery.*/}
        {/*  </p>*/}
        {/*</div>*/}

        <Swiper
          {...swiperConfig}
          modules={[Autoplay, Pagination]}
          className={cn(styles.slider, 'swiper')}
        >
          {items.map((t) => {
            const avatarUrl = pickImageUrl(t.avatar);
            const short =
              t.message.length > 260 ? `${t.message.slice(0, 257)}…` : t.message;

            return (
              <SwiperSlide key={t.id} className={styles.slide}>
                <QuoteCard
                  variant="testimonial"
                  message={short}
                  name={t.authorName}
                  role={t.authorRole ?? undefined}
                  avatarUrl={avatarUrl}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
