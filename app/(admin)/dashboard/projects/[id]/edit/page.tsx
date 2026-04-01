import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getProjectById } from '@/lib/data/admin/projects';
import { listActiveProjectCategories } from '@/lib/data/admin/projects/categories';
import { ProjectEditForm } from '@/components/admin/dashboard/projects/project-form';

type Props = {
  params: Promise<{ id: string }>;
};

async function EditProjectContent({ params }: Props) {
  const { id } = await params;
  const [row, categories] = await Promise.all([getProjectById(id), listActiveProjectCategories()]);

  if (!row) return notFound();

  return <ProjectEditForm row={row} categories={categories} />;
}

export default function EditProjectPage(props: Props) {
  return (
    <Suspense fallback={<div className="alert alert-info">Loading project…</div>}>
      <EditProjectContent {...props} />
    </Suspense>
  );
}
