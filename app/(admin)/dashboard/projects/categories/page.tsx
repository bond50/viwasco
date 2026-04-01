import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteProjectCategory } from '@/actions/project-categories';
import { listProjectCategories } from '@/lib/data/admin/projects/categories';

export default async function ProjectCategoriesPage() {
  const rowsRaw = await listProjectCategories();
  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.name,
    extra1: row.slug,
    extra2: row.is_active ? 'Active' : 'Hidden',
  }));

  return (
    <SimpleList
      headerLabel="Project Categories"
      rows={rows}
      onDeleteAction={deleteProjectCategory}
      editBasePath="/dashboard/projects/categories"
      addHref="/dashboard/projects/categories/new"
      columns={{ nameLabel: 'Name', extra1Label: 'Slug', extra2Label: 'Visibility' }}
    />
  );
}
