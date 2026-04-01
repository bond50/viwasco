import { Suspense } from 'react';

import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { listServices } from '@/lib/data/admin/services';
import { deleteService } from '@/actions/services';

function Fallback() {
  return <div className="alert alert-info">Loading services…</div>;
}

async function Content() {
  const rowsRaw = await listServices();

  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.title,
    extra1: row.slug,
    extra2: [row.is_active ? 'Active' : 'Inactive', row.is_public ? 'Public' : 'Private'].join(
      ' • ',
    ),
  }));

  async function onDeleteAction(id: string) {
    'use server';
    await deleteService(id);
  }

  return (
    <SimpleList
      headerLabel="Services"
      editBasePath="/dashboard/services"
      rows={rows}
      onDeleteAction={onDeleteAction}
      addHref="/dashboard/services/new"
      columns={{
        nameLabel: 'Title',
        extra1Label: 'Slug',
        extra2Label: 'Status',
      }}
    />
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
