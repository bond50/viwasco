// app/(admin)/dashboard/about/leadership/teams/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';

import { listCategories, listTeamsByCategory } from '@/lib/data/admin/about/content/leadership';
import { RankedList } from '@/components/common/ranked-list';
import { Button } from '@/components/form-elements/button';
import CategoryPicker from '@/components/admin/dashboard/leadership/teams/category-picker';
import { deleteTeamMember, reorderTeamMembers } from '@/actions/about/content/leadership';

type PageSearchParams = {
  categoryId?: string;
};

type PageProps = {
  searchParams?: Promise<PageSearchParams>;
};

function Fallback() {
  return <div className="alert alert-info">Loading teams…</div>;
}

// Async server component used inside Suspense
async function Content({ searchParams }: PageProps) {
  const cats = await listCategories();

  if (cats.length === 0) {
    return (
      <div className="alert alert-info">
        No categories yet. Create one first from{' '}
        <Link href="/dashboard/about/leadership/categories">Leadership Categories</Link>.
      </div>
    );
  }

  // ✅ Unwrap the Promise before accessing categoryId
  const params = (await searchParams) ?? {};
  const selectedCategoryId = params.categoryId;

  const selected = cats.find((c) => c.id === selectedCategoryId) ?? cats[0];

  const rowsRaw = await listTeamsByCategory(selected.id);

  // Map into RankedList rows
  const rows = rowsRaw.map((m) => ({
    id: m.id,
    rank: m.rank,
    title: m.name,
    extra1: m.position,
    extra2: `${m.isActive ? 'Active' : 'Inactive'}${m.isFeatured ? ' · Featured' : ''}`,
    quickLinks: [
      {
        label: 'Settings',
        href: `/dashboard/about/leadership/teams/${m.id}`,
      },
    ],
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderTeamMembers(selected.id, items);
  }

  async function onDeleteAction(id: string) {
    'use server';
    await deleteTeamMember(id);
  }

  return (
    <>
      <CategoryPicker
        options={cats.map((c) => ({ id: c.id, name: c.name }))}
        selectedId={selected.id}
      />

      <RankedList
        headerLabel={`Team — ${selected.name}`}
        editBasePath="/dashboard/about/leadership/teams"
        rows={rows}
        onDeleteAction={onDeleteAction}
        onReorderAction={onReorderAction}
        addHref={`/dashboard/about/leadership/teams/new?categoryId=${selected.id}`}
        columns={{ nameLabel: 'Name', extra1Label: 'Position', extra2Label: 'Status' }}
      />

      <div className="mt-3">
        <Link href="/dashboard/about/leadership/categories">
          <Button variant="outline-primary" size="small" type="button">
            Manage Categories
          </Button>
        </Link>
      </div>
    </>
  );
}

export default function TeamListPage(props: PageProps) {
  return (
    <Suspense fallback={<Fallback />}>
      <Content {...props} />
    </Suspense>
  );
}
