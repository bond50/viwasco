// app/(dashboard)/dashboard/about/awards/page-seo.tsx
import { Suspense } from 'react';
import { deleteOrgAward, reorderOrgAwards } from '@/actions/about/content/awards';
import { listAwards } from '@/lib/data/admin/about/content/awards';
import { RankedList } from '@/components/common/ranked-list';
import { AdminBreadcrumb } from '@/components/reusables/breadcrumb/admin';

async function AwardsTable() {
  const rowsRaw = await listAwards();
  const rows = rowsRaw.map((x) => ({
    id: x.id,
    rank: x.rank,
    title: x.title,
    extra1: x.issuer ?? null,
    extra2: x.date ? new Date(x.date).toDateString() : null,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderOrgAwards(items);
  }

  async function onDeleteAction(id: string) {
    'use server';
    await deleteOrgAward(id);
  }

  return (
    <RankedList
      headerLabel="Awards"
      editBasePath="/dashboard/about/awards"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/awards/new"
      secondaryTextField="extra1"
      columns={{ nameLabel: 'Award', extra1Label: 'Issuer', extra2Label: 'Date' }}
    />
  );
}

export default function AwardsPage() {
  return (
    <>
      <AdminBreadcrumb pageTitle="Awards" />
      <Suspense fallback={<div>Loading awards…</div>}>
        <AwardsTable />
      </Suspense>
    </>
  );
}
