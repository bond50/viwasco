// app/(dashboard)/dashboard/about/leadership/categories/page-seo.tsx
import { Suspense } from 'react';
import {
  deleteCategory,
  reorderCategories,
} from '@/actions/about/content/leadership/team-categories';
import { listCategories } from '@/lib/data/admin/about/content/leadership';
import { RankedList } from '@/components/common/ranked-list';

function Fallback() {
  return <div className="alert alert-info">Loading categories…</div>;
}

async function Content() {
  const rowsRaw = await listCategories();

  const rows = rowsRaw.map((c) => ({
    id: c.id,
    rank: c.rank,
    title: c.name,
    extra1: `${c.categoryType} — ${c._count.teamMembers} member${c._count.teamMembers === 1 ? '' : 's'}`,
    extra2: c.slug,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderCategories(items);
  }

  async function onDeleteAction(id: string) {
    'use server';
    await deleteCategory(id);
  }

  return (
    <RankedList
      headerLabel="Leadership Categories"
      editBasePath="/dashboard/about/leadership/categories"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/leadership/categories/new"
      columns={{ nameLabel: 'Category', extra1Label: 'Info', extra2Label: 'Slug' }}
    />
  );
}

export default function CategoryListPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
