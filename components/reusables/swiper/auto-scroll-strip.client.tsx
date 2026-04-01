'use client';

import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

import 'swiper/css';
import { cn } from '@/lib/utils';

type AutoScrollStripProps<TItem> = {
  items: TItem[];
  renderSlideAction: (item: TItem, index: number) => React.ReactNode;
  className?: string;
  swiperClassName?: string;
  speed?: number; // default 6000 – same as Clients
  spaceBetween?: number; // default 40 – same as Clients
};

export function AutoScrollStrip<TItem>({
  items,
  renderSlideAction,
  className,
  swiperClassName,
  speed = 6000,
  spaceBetween = 40,
}: AutoScrollStripProps<TItem>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const swiperInstanceRef = useRef<Swiper | null>(null);

  // 🔁 Duplicate items just like your Clients component
  const duplicatedItems = [...items, ...items];

  useEffect(() => {
    if (!containerRef.current) return;

    // destroy old instance if any
    if (swiperInstanceRef.current) {
      swiperInstanceRef.current.destroy(true, true);
      swiperInstanceRef.current = null;
    }

    const options: SwiperOptions & { modules: unknown[] } = {
      modules: [Autoplay],
      loop: true,
      speed,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
      },
      freeMode: true,
      centeredSlides: true,
      slideToClickedSlide: true,
      slidesPerView: 'auto',
      spaceBetween,
      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 6,
          spaceBetween: 40,
        },
      },
    };

    swiperInstanceRef.current = new Swiper(containerRef.current, options);

    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [items, speed, spaceBetween]);

  if (!items.length) return null;

  return (
    <div className={cn(className)}>
      <div ref={containerRef} className={cn('swiper', swiperClassName, 'init-swiper')}>
        <div className="swiper-wrapper">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="swiper-slide">
              {renderSlideAction(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
