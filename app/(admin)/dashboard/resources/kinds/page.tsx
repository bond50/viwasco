import { Suspense } from 'react';

import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteResourceKind } from '@/actions/resources/kinds';
import { listResourceKinds } from '@/lib/data/admin/resources/kinds';

function Fallback() {
  return <div className="alert alert-info">Loading resource kinds…</div>;
}

async function Content() {
  const rowsRaw = await listResourceKinds();

  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.name,
    extra1: row._count.resources.toString(),
    extra2: row.description || 'No description',
  }));

  async function onDeleteAction(id: string) {
    'use server';
    await deleteResourceKind(id);
  }

  return (
    <SimpleList
      headerLabel="Resource Kinds"
      editBasePath="/dashboard/resources/kinds"
      rows={rows}
      onDeleteAction={onDeleteAction}
      addHref="/dashboard/resources/kinds/new"
      columns={{
        nameLabel: 'Name',
        extra1Label: 'Resources',
        extra2Label: 'Description',
      }}
    />
  );
}

export default function ResourceKindsPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
