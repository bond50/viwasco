// components/public/about/faqs/index.tsx
import 'server-only';

import { getFaqs } from '@/lib/data/public/about/getters';
import { FaqsViewClient, type PublicFaq } from './faqs.client';

/**
 * ✅ SELF-FETCHING SERVER COMPONENT
 * Use under Suspense:
 *   <Suspense fallback={<FaqsSkeleton />}>
 *     <FaqsSection />
 *   </Suspense>
 */
export async function FaqsSection() {
  const faqs = await getFaqs();

  if (!faqs?.length) return null;

  // Ensure shape matches PublicFaq with strict typing.
  const faqsUi: PublicFaq[] = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    rank: f.rank ?? 0,
  }));

  return <FaqsViewClient faqs={faqsUi} />;
}

// Re-export types if other places need them
export type { PublicFaq };
