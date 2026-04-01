import { Suspense } from 'react';
import { deletePartner, reorderPartners } from '@/actions/about/content/partners';
import { RankedList } from '@/components/common/ranked-list';
import { listPartners } from '@/lib/data/admin/about/content/parners';

function Fallback() {
  return <div className="alert alert-info">Loading partners…</div>;
}

async function Content() {
  const rowsRaw = await listPartners();

  const rows = rowsRaw.map((x) => ({
    id: x.id,
    rank: x.rank,
    title: x.name,
    extra1: [x.partnershipType, x.website].filter(Boolean).join(' · '),
    extra2: null,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderPartners(items);
  }

  async function onDeleteAction(id: string) {
    'use server';
    await deletePartner(id);
  }

  return (
    <RankedList
      headerLabel="Partners"
      editBasePath="/dashboard/about/partners"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/partners/new"
      secondaryTextField="extra1"
      columns={{ nameLabel: 'Partner', extra1Label: 'Type · Website', extra2Label: 'Icon' }}
    />
  );
}

export default function PartnersPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
