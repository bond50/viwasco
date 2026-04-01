import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteCareerType } from '@/actions/careers/types';
import { listCareerTypes } from '@/lib/data/admin/careers/types';

export default async function CareerTypesPage() {
  const rowsRaw = await listCareerTypes();
  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.name,
    extra1: row.slug,
    extra2: row.is_active ? 'Active' : 'Hidden',
  }));
  return (
    <SimpleList
      headerLabel="Career Types"
      rows={rows}
      onDeleteAction={deleteCareerType}
      editBasePath="/dashboard/careers/types"
      addHref="/dashboard/careers/types/new"
      columns={{ nameLabel: 'Name', extra1Label: 'Slug', extra2Label: 'Visibility' }}
    />
  );
}
