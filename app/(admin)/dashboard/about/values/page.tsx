import { Suspense } from 'react';
import { CoreValuesForm } from '@/components/admin/dashboard/values/core-values-form';
import { getOrgCoreValuesFields, listCoreValues } from '@/lib/data/admin/about/content/values';

function Fallback() {
  return <div className="alert alert-info">Loading core values…</div>;
}

async function Content() {
  const [rows, org] = await Promise.all([listCoreValues(), getOrgCoreValuesFields()]);

  const defaultValues = {
    leadText: org?.coreValuesLeadText ?? '',
    coreValuesImage: (org?.coreValuesImage as unknown) ?? null,
    values: rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      icon: r.icon ?? null,
      rank: r.rank,
    })),
  };

  return <CoreValuesForm defaultValuesJson={JSON.stringify(defaultValues)} />;
}

export default function ValuesPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
