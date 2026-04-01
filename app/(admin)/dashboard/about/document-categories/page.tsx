import { Suspense } from 'react';

import { RankedList } from '@/components/common/ranked-list';
import {
  deleteDocCategory,
  reorderDocCategories,
} from '@/actions/about/content/document-categories';
import { listDocumentCategories } from '@/lib/data/admin/about/content/document-categories';

async function DocumentCategoriesTable() {
  const rowsRaw = await listDocumentCategories();

  const rows = rowsRaw.map((cat) => ({
    id: cat.id,
    rank: cat.rank,
    title: cat.name,
    extra1: [
      cat.description,
      `${cat._count.documents} document${cat._count.documents === 1 ? '' : 's'}`,
      cat.isActive ? 'Active' : 'Hidden',
    ]
      .filter(Boolean)
      .join(' · '),
    extra2: null,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderDocCategories(items);
  }

  async function onDeleteAction(id: string) {
    'use server';
    await deleteDocCategory(id);
  }

  return (
    <RankedList
      headerLabel="Document Categories"
      editBasePath="/dashboard/about/document-categories"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/document-categories/new"
      secondaryTextField="extra1"
      columns={{
        nameLabel: 'Category',
        extra1Label: 'Details',
        extra2Label: 'Icon',
      }}
    />
  );
}

export default function DocumentCategoriesPage() {
  return (
    <Suspense fallback={<div>Loading categories…</div>}>
      <DocumentCategoriesTable />
    </Suspense>
  );
}
