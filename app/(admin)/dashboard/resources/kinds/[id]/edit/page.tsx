import { notFound } from 'next/navigation';

import { getResourceKindById } from '@/lib/data/admin/resources/kinds';
import { ResourceKindEditForm } from '@/components/admin/dashboard/resources/kind-form';

type Props = { params: Promise<{ id: string }> };

async function EditResourceKindContent({ params }: Props) {
  const { id } = await params;
  const row = await getResourceKindById(id);
  if (!row) return notFound();

  return <ResourceKindEditForm row={row} />;
}

export default async function EditResourceKindPage(props: Props) {
  return <EditResourceKindContent {...props} />;
}
