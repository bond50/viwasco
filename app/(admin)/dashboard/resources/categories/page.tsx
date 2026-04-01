import { Suspense } from 'react';

import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteResourceCategory } from '@/actions/resources/categories';
import { listResourceCategories } from '@/lib/data/admin/resources/categories';

function Fallback() {
  return <div className="alert alert-info">Loading resource categories…</div>;
}

async function Content() {
  const rowsRaw = await listResourceCategories();

  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.name,
    extra1: row.kindName,
    extra2: row.description || 'No description',
  }));

  async function onDeleteAction(id: string) {
    'use server';
    await deleteResourceCategory(id);
  }

  return (
    <SimpleList
      headerLabel="Resource Categories"
      editBasePath="/dashboard/resources/categories"
      rows={rows}
      onDeleteAction={onDeleteAction}
      addHref="/dashboard/resources/categories/new"
      columns={{
        nameLabel: 'Name',
        extra1Label: 'Kind',
        extra2Label: 'Description',
      }}
    />
  );
}

export default function ResourceCategoriesPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
