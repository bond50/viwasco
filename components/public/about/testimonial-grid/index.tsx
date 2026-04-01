import { QuoteCard } from '@/components/public/about/quote-card';
import { pickImageUrl } from '@/lib/public/media';

type Testimonial = {
  id: string;
  authorName: string;
  authorRole?: string | null;
  message: string;
  avatar?: unknown | null;
};

interface TestimonialsGridProps {
  items: Testimonial[];
}

export function TestimonialsGrid({ items }: TestimonialsGridProps) {
  if (!items.length) {
    return (
      <p className="text-muted text-center mb-0">
        No testimonials have been published yet.
      </p>
    );
  }

  return (
    <div className="row g-4">
      {items.map((t) => {
        const avatarUrl = pickImageUrl(t.avatar);

        const short =
          t.message.length > 260 ? `${t.message.slice(0, 257)}…` : t.message;

        return (
          <div key={t.id} className="col-12 col-md-6 col-xl-4">
            <QuoteCard
              variant="testimonial"
              message={short}
              name={t.authorName}
              role={t.authorRole ?? undefined}
              avatarUrl={avatarUrl}
            />
          </div>
        );
      })}
    </div>
  );
}
