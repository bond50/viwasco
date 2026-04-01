import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ServiceCategoryEditForm } from '@/components/admin/dashboard/services/category-form';
import { getServiceCategoryById } from '@/lib/data/admin/services/service-categories';

type Props = {
  params: Promise<{ id: string }>;
};

async function EditServiceCategoryContent({ params }: Props) {
  const { id } = await params;
  const row = await getServiceCategoryById(id);

  if (!row) return notFound();

  return <ServiceCategoryEditForm row={row} />;
}

export default function EditServiceCategoryPage(props: Props) {
  return (
    <Suspense fallback={<div className="alert alert-info">Loading service category…</div>}>
      <EditServiceCategoryContent {...props} />
    </Suspense>
  );
}
