import { notFound } from 'next/navigation';

import { NewsCategoryEditForm } from '@/components/admin/dashboard/news-category-form';
import { getNewsCategoryById } from '@/lib/data/admin/news/categories';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditNewsCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const row = await getNewsCategoryById(id);
  if (!row) return notFound();

  return <NewsCategoryEditForm row={row} />;
}
