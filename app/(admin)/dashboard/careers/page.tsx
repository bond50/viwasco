import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteCareer } from '@/actions/careers';
import { listCareers } from '@/lib/data/admin/careers';

export default async function CareersPage() {
  const rowsRaw = await listCareers();
  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.title,
    extra1: row.typeName,
    extra2: row.is_active ? 'Active' : 'Hidden',
  }));
  return (
    <SimpleList
      headerLabel="Careers"
      rows={rows}
      onDeleteAction={deleteCareer}
      editBasePath="/dashboard/careers"
      addHref="/dashboard/careers/new"
      columns={{ nameLabel: 'Title', extra1Label: 'Type', extra2Label: 'Visibility' }}
    />
  );
}
