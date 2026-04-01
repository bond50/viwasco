import { notFound } from 'next/navigation';
import { getFaqById } from '@/lib/data/admin/about/content/faqs';
import { FaqEditForm } from '@/components/admin/dashboard/faqs/faq-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditFaqPage({ params }: Props) {
  const { id } = await params;
  const faq = await getFaqById(id);
  if (!faq) return notFound();

  return <FaqEditForm faq={faq} />;
}
