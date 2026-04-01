import { notFound } from 'next/navigation';
import { getTestimonialById } from '@/lib/data/admin/about/content/testimonials';
import { TestimonialEditForm } from '@/components/admin/dashboard/testimonials/testimonial-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params;
  const row = await getTestimonialById(id);
  if (!row) return notFound();

  return <TestimonialEditForm testimonial={row} />;
}
