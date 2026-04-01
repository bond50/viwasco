import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/data/admin/about/content/leadership';
import { CategoryEditForm } from '@/components/admin/dashboard/leadership/category-form';

type Params = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Params) {
  const { id } = await params;
  const row = await getCategoryById(id);
  if (!row) return notFound();

  return <CategoryEditForm row={row} />;
}
