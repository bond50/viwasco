import { Suspense } from 'react';

import { RankedList } from '@/components/common/ranked-list';
import { deleteOrgDocument, reorderOrgDocuments } from '@/actions/about/content/documents';
import { listDocuments } from '@/lib/data/admin/about/content/documents';

async function DocumentsTable() {
  const rowsRaw = await listDocuments();

  const rows = rowsRaw.map((doc) => ({
    id: doc.id,
    rank: doc.rank,
    title: doc.title,
    extra1: [doc.category?.name, doc.published ? 'Published' : 'Hidden']
      .filter(Boolean)
      .join(' · '),
    extra2: null,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderOrgDocuments(items);
  }

  async function onDeleteAction(id: string) {
    'use server';
    await deleteOrgDocument(id);
  }

  return (
    <RankedList
      headerLabel="Documents / Resources"
      editBasePath="/dashboard/about/documents"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/documents/new"
      secondaryTextField="extra1"
      columns={{
        nameLabel: 'Document',
        extra1Label: 'Category / Status',
        extra2Label: 'Icon',
      }}
    />
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div>Loading documents…</div>}>
      <DocumentsTable />
    </Suspense>
  );
}
