import { listResourceKinds } from '@/lib/data/admin/resources/kinds';
import { ResourceCategoryCreateForm } from '@/components/admin/dashboard/resources/category-form';

export default async function NewResourceCategoryPage() {
  const kinds = await listResourceKinds();
  return (
    <ResourceCategoryCreateForm kinds={kinds.map((kind) => ({ id: kind.id, name: kind.name }))} />
  );
}
