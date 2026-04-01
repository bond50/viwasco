import { notFound } from 'next/navigation';

import { getResourceCategoryById } from '@/lib/data/admin/resources/categories';
import { listResourceKinds } from '@/lib/data/admin/resources/kinds';
import { ResourceCategoryEditForm } from '@/components/admin/dashboard/resources/category-form';

type Props = { params: Promise<{ id: string }> };

async function EditResourceCategoryContent({ params }: Props) {
  const { id } = await params;
  const [row, kinds] = await Promise.all([getResourceCategoryById(id), listResourceKinds()]);

  if (!row) return notFound();

  return (
    <ResourceCategoryEditForm
      row={row}
      kinds={kinds.map((kind) => ({ id: kind.id, name: kind.name }))}
    />
  );
}

export default async function EditResourceCategoryPage(props: Props) {
  return <EditResourceCategoryContent {...props} />;
}
