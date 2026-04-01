import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ServiceEditForm } from '@/components/admin/dashboard/services/service-form';
import { getServiceById } from '@/lib/data/admin/services';

type Props = {
  params: Promise<{ id: string }>;
};

async function EditServiceContent({ params }: Props) {
  const { id } = await params;

  const row = await getServiceById(id);

  if (!row) return notFound();

  return <ServiceEditForm row={row} />;
}

export default function EditServicePage(props: Props) {
  return (
    <Suspense fallback={<div className="alert alert-info">Loading service…</div>}>
      <EditServiceContent {...props} />
    </Suspense>
  );
}
