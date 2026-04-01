'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import Image from 'next/image';
import 'swiper/css';
import styles from './partners.module.css';
import { cn } from '@/lib/utils';
import type { UploadedImageResponse } from '@/lib/schemas/shared/image';
import type { PartnershipType } from '@/lib/schemas/about/content/partners';

export type PartnerPreview = {
  id: string;
  name: string;
  slug: string;
  logo: UploadedImageResponse | null;
  isActive: boolean;
  partnershipType: PartnershipType;
};

type Props = {
  partners: PartnerPreview[];
};

export function PartnersStripClient({ partners }: Props) {
  if (!partners.length) return null;

  const swiperConfig: SwiperOptions = {
    loop: true,
    speed: 6000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    allowTouchMove: false,
    slidesPerView: 'auto',
    spaceBetween: 40,
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 20 },
      640: { slidesPerView: 3, spaceBetween: 20 },
      992: { slidesPerView: 4, spaceBetween: 30 },
      1200: { slidesPerView: 6, spaceBetween: 40 },
    },
  };

  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className={cn('section', styles.partners)}>

      <div data-aos="fade-up" data-aos-delay="100">
        <Swiper
          {...swiperConfig}
          modules={[Autoplay]}
          className={cn(styles['partners-slider'], 'swiper', 'init-swiper')}
        >
          {duplicatedPartners.map((partner, index) => (
            <SwiperSlide
              key={`${partner.id}-${index}`}
              className={styles['swiper-slide']}
            >
              <div className={styles['partner-logo']}>
                {partner.logo ? (
                  <div className={styles['image-container']}>
                    <Image
                      src={
                        partner.logo.variants?.small?.secure_url ||
                        partner.logo.main?.secure_url ||
                        partner.logo.main?.url
                      }
                      alt={partner.name}
                      fill
                      className={styles['partner-image']}
                      priority={index < partners.length}
                    />
                  </div>
                ) : (
                  <div className={styles['partner-logo-fallback']}>
                    {partner.name}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
