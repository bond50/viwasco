import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteNewsletter } from '@/actions/newsletters';
import { listNewsletters } from '@/lib/data/admin/newsletters';

export default async function NewslettersPage() {
  const rowsRaw = await listNewsletters();
  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.title,
    extra1: row.categoryName,
    extra2: row.is_active ? 'Active' : 'Hidden',
  }));
  return (
    <SimpleList
      headerLabel="Newsletters"
      rows={rows}
      onDeleteAction={deleteNewsletter}
      editBasePath="/dashboard/newsletters"
      addHref="/dashboard/newsletters/new"
      columns={{ nameLabel: 'Title', extra1Label: 'Category', extra2Label: 'Visibility' }}
    />
  );
}
