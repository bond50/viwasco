import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteNewsCategory } from '@/actions/news-categories';
import { listNewsCategories } from '@/lib/data/admin/news/categories';

export default async function NewsCategoriesPage() {
  const rowsRaw = await listNewsCategories();
  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.name,
    extra1: row.slug,
    extra2: row.is_active ? 'Active' : 'Hidden',
  }));

  return (
    <SimpleList
      headerLabel="News Categories"
      rows={rows}
      onDeleteAction={deleteNewsCategory}
      editBasePath="/dashboard/news/categories"
      addHref="/dashboard/news/categories/new"
      columns={{ nameLabel: 'Name', extra1Label: 'Slug', extra2Label: 'Visibility' }}
    />
  );
}
