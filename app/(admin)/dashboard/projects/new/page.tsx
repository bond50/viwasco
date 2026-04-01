import { Suspense } from 'react';

import { listActiveProjectCategories } from '@/lib/data/admin/projects/categories';
import { ProjectCreateForm } from '@/components/admin/dashboard/projects/project-form';

async function Content() {
  const categories = await listActiveProjectCategories();
  return <ProjectCreateForm categories={categories} />;
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="alert alert-info">Loading project form…</div>}>
      <Content />
    </Suspense>
  );
}
