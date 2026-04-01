import { Suspense } from 'react';
import { deleteOrgMetric, reorderOrgMetrics } from '@/actions/about/content/metrics';
import { listMetrics } from '@/lib/data/admin/about/content/metrics';
import { RankedList } from '@/components/common/ranked-list';

function Fallback() {
  return <div className="alert alert-info">Loading metrics…</div>;
}

function formatValue(v: number, unit?: string | null): string {
  return `${v}${unit ? ` ${unit}` : ''}`;
}

async function Content() {
  const rowsRaw = await listMetrics();
  const rows = rowsRaw.map((x) => ({
    id: x.id,
    rank: x.rank,
    title: x.label,
    extra1: formatValue(x.value, x.unit),
    extra2: x.icon ?? null,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderOrgMetrics(items);
  }
  async function onDeleteAction(id: string) {
    'use server';
    await deleteOrgMetric(id);
  }

  return (
    <RankedList
      headerLabel="Metrics"
      editBasePath="/dashboard/about/metrics"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/metrics/new"
      secondaryTextField="extra1"
      columns={{ nameLabel: 'Label', extra1Label: 'Value', extra2Label: 'Icon' }}
    />
  );
}

export default function MetricsPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
