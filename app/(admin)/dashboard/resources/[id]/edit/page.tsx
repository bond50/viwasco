import { notFound } from 'next/navigation';

import { getResourceById } from '@/lib/data/admin/resources';
import { listResourceKinds } from '@/lib/data/admin/resources/kinds';
import { listResourceCategories } from '@/lib/data/admin/resources/categories';
import { ResourceEditForm } from '@/components/admin/dashboard/resources/resource-form';

type Props = { params: Promise<{ id: string }> };

async function EditResourceContent({ params }: Props) {
  const { id } = await params;
  const [row, kinds, categories] = await Promise.all([
    getResourceById(id),
    listResourceKinds(),
    listResourceCategories(),
  ]);

  if (!row) return notFound();

  return (
    <ResourceEditForm
      row={row}
      kinds={kinds.map((kind) => ({ id: kind.id, name: kind.name, slug: kind.slug }))}
      categories={categories.map((category) => ({
        id: category.id,
        kindId: category.kindId,
        name: category.name,
        slug: category.slug,
      }))}
    />
  );
}

export default async function EditResourcePage(props: Props) {
  return <EditResourceContent {...props} />;
}
