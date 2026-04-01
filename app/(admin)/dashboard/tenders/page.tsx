import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { listTenders } from '@/lib/data/admin/tenders';
import { deleteTender } from '@/actions/tenders';

export default async function TendersPage() {
  const rowsRaw = await listTenders();
  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.title,
    extra1: row.status,
    extra2: row.is_active ? 'Active' : 'Hidden',
  }));

  return (
    <SimpleList
      headerLabel="Tenders"
      rows={rows}
      onDeleteAction={deleteTender}
      editBasePath="/dashboard/tenders"
      addHref="/dashboard/tenders/new"
      columns={{ nameLabel: 'Title', extra1Label: 'Status', extra2Label: 'Visibility' }}
    />
  );
}
