import { notFound } from 'next/navigation';

import { ProjectCategoryEditForm } from '@/components/admin/dashboard/projects/project-category-form';
import { getProjectCategoryById } from '@/lib/data/admin/projects/categories';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const row = await getProjectCategoryById(id);
  if (!row) return notFound();

  return <ProjectCategoryEditForm row={row} />;
}
