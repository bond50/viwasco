import { notFound } from 'next/navigation';
import { getMetricById } from '@/lib/data/admin/about/content/metrics';
import { MetricEditForm } from '@/components/admin/dashboard/metrics/metric-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditMetricPage({ params }: Props) {
  const { id } = await params;
  const row = await getMetricById(id);
  if (!row) return notFound();
  return <MetricEditForm metric={row} />;
}
