import { notFound } from 'next/navigation';

import { NewsEditForm } from '@/components/admin/dashboard/news/news-form';
import { getNewsById } from '@/lib/data/admin/news';
import { listActiveNewsCategories } from '@/lib/data/admin/news/categories';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditNewsPage({ params }: PageProps) {
  const { id } = await params;
  const [row, categories] = await Promise.all([getNewsById(id), listActiveNewsCategories()]);

  if (!row) return notFound();

  return <NewsEditForm row={row} categories={categories} />;
}
