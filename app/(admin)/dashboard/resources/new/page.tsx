import { ResourceCreateForm } from '@/components/admin/dashboard/resources/resource-form';
import { listResourceKinds } from '@/lib/data/admin/resources/kinds';
import { listResourceCategories } from '@/lib/data/admin/resources/categories';

export default async function NewResourcePage() {
  const [kinds, categories] = await Promise.all([listResourceKinds(), listResourceCategories()]);

  return (
    <ResourceCreateForm
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
