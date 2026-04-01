import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteNewsletterCategory } from '@/actions/newsletters/categories';
import { listNewsletterCategories } from '@/lib/data/admin/newsletters/categories';

export default async function NewsletterCategoriesPage() {
  const rowsRaw = await listNewsletterCategories();
  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.name,
    extra1: row.slug,
    extra2: row.is_active ? 'Active' : 'Hidden',
  }));
  return (
    <SimpleList
      headerLabel="Newsletter Categories"
      rows={rows}
      onDeleteAction={deleteNewsletterCategory}
      editBasePath="/dashboard/newsletters/categories"
      addHref="/dashboard/newsletters/categories/new"
      columns={{ nameLabel: 'Name', extra1Label: 'Slug', extra2Label: 'Visibility' }}
    />
  );
}
