import React, { Suspense } from 'react';
import { connection } from 'next/server';
import SiteHeader from '@/components/public/layout/site-header';
import { VideoHeroSkeleton } from '@/components/public/home/hero/video/video-skeleton';
import { HeroResolver } from '@/components/public/home/hero/hero-resolver';
import { Footer } from '@/components/public/layout/footer';
import { AboutOverviewSkeleton } from '@/components/public/about/about-overview/skeleton';
import { AboutOverviewSection } from '@/components/public/about/about-overview';
import { PartnersStripSkeleton } from '@/components/public/about/partners/partners-strip-skeleton';
import { PartnersStripSection } from '@/components/public/about/partners';
import { FaqsSkeleton } from '@/components/public/about/faqs/skeleton';
import { FaqsSection } from '@/components/public/about/faqs';

const Page = async () => {
  await connection();

  return (
    <div className="d-flex flex-column min-vh-100">
      <SiteHeader />

      <main className="flex-grow-1">
        <Suspense fallback={<VideoHeroSkeleton />}>
          <HeroResolver />
        </Suspense>
        <Suspense fallback={<PartnersStripSkeleton />}>
          <PartnersStripSection />
        </Suspense>
        <Suspense fallback={<AboutOverviewSkeleton />}>
          <AboutOverviewSection />
        </Suspense>
        <Suspense fallback={<FaqsSkeleton />}>
          <FaqsSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
