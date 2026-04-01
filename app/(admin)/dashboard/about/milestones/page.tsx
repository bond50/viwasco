import { Suspense } from 'react';
import { deleteOrgMilestone, reorderOrgMilestones } from '@/actions/about/content/milestones';
import { listMilestones } from '@/lib/data/admin/about/content/milestones';
import { RankedList } from '@/components/common/ranked-list';

function Fallback() {
  return <div className="alert alert-info">Loading milestones…</div>;
}

function truncate(input: string, max = 120): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1)}…`;
}

function formatWhen(year: number | null | undefined, date: Date | null | undefined): string | null {
  const parts: string[] = [];
  if (typeof year === 'number') parts.push(String(year));
  if (date) parts.push(new Date(date).toDateString());
  if (!parts.length) return null;
  return parts.join(' · ');
}

async function Content() {
  const rowsRaw = await listMilestones();

  const rows = rowsRaw.map((x) => ({
    id: x.id,
    rank: x.rank,
    title: x.title,
    extra1: x.summary ? truncate(x.summary) : null,
    extra2: formatWhen(x.year ?? null, x.date ?? null),
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderOrgMilestones(items);
  }

  async function onDeleteAction(id: string) {
    'use server';
    await deleteOrgMilestone(id);
  }

  return (
    <RankedList
      headerLabel="Milestones"
      editBasePath="/dashboard/about/milestones"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/milestones/new"
      secondaryTextField="extra1"
      columns={{ nameLabel: 'Milestone', extra1Label: 'Summary', extra2Label: 'Year / Date' }}
    />
  );
}

export default function MilestonesPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
