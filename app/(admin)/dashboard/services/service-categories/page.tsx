import { Suspense } from 'react';
import { listServiceCategories } from '@/lib/data/admin/services/service-categories';
import { deleteServiceCategory } from '@/actions/services/service-categories';
import { SimpleList, type SimpleRow } from '@/components/common/simple-list';

function Fallback() {
  return <div className="alert alert-info">Loading service categories…</div>;
}

async function Content() {
  const rowsRaw = await listServiceCategories();

  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.name,
    extra1: row.description,
    extra2: `${row._count.services} service(s)`,
  }));

  async function onDeleteAction(id: string) {
    'use server';
    await deleteServiceCategory(id);
  }

  return (
    <SimpleList
      headerLabel="Service Categories"
      editBasePath="/dashboard/services/service-categories"
      rows={rows}
      onDeleteAction={onDeleteAction}
      addHref="/dashboard/services/service-categories/new"
      columns={{
        nameLabel: 'Name',
        extra1Label: 'Description',
        extra2Label: 'Usage',
      }}
    />
  );
}

export default function ServiceCategoriesPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
