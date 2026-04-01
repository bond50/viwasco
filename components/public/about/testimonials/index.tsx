// components/public/about/testimonials/index.tsx
import 'server-only';

import { getTestimonials } from '@/lib/data/public/about/getters';
import { TestimonialsGrid } from '@/components/public/about/testimonial-grid';
import { TestimonialsStripClient } from './testimonials-strip.client';

type Testimonial = {
  id: string;
  authorName: string;
  authorRole?: string | null;
  message: string;
  avatar?: unknown | null;
  rank?: number | null;
  published?: boolean | null;
};

/** ✅ Standalone grid (no swiper) */
export async function TestimonialsSection() {
  const items = (await getTestimonials()) as Testimonial[];

  if (!items?.length) {
    return (
      <p className="text-muted text-center mb-0">
        No testimonials have been published yet.
      </p>
    );
  }

  return <TestimonialsGrid items={items} />;
}

/** ✅ Swiper strip for /about page */
export async function TestimonialsStripSection() {
  const items = (await getTestimonials()) as Testimonial[];

  if (!items?.length) return null;

  // Optional: keep it light on the homepage
  const top = items.slice(0, 8);

  return <TestimonialsStripClient items={top} />;
}
