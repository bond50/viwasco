import { notFound } from 'next/navigation';
import { NewsletterCategoryEditForm } from '@/components/admin/dashboard/newsletters/newsletter-category-form';
import { getNewsletterCategoryById } from '@/lib/data/admin/newsletters/categories';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditNewsletterCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const row = await getNewsletterCategoryById(id);
  if (!row) return notFound();
  return <NewsletterCategoryEditForm row={row} />;
}
