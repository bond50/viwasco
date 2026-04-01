import { Suspense } from 'react';

import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteResource } from '@/actions/resources';
import { listResources } from '@/lib/data/admin/resources';

function Fallback() {
  return <div className="alert alert-info">Loading resources…</div>;
}

async function Content() {
  const rowsRaw = await listResources();

  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.title,
    extra1: row.kindName,
    extra2: row.categoryName ?? 'Uncategorized',
  }));

  async function onDeleteAction(id: string) {
    'use server';
    await deleteResource(id);
  }

  return (
    <SimpleList
      headerLabel="Resources"
      editBasePath="/dashboard/resources"
      rows={rows}
      onDeleteAction={onDeleteAction}
      addHref="/dashboard/resources/new"
      columns={{
        nameLabel: 'Title',
        extra1Label: 'Kind',
        extra2Label: 'Category',
      }}
    />
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
