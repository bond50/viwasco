import { Suspense } from 'react';
import { deleteOrgTestimonial, reorderOrgTestimonials } from '@/actions/about/content/testimonials';
import { listTestimonials } from '@/lib/data/admin/about/content/testimonials';
import { RankedList } from '@/components/common/ranked-list';

function Fallback() {
  return <div className="alert alert-info">Loading testimonials…</div>;
}

function truncate(input: string, max = 120): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1)}…`;
}

async function Content() {
  const rowsRaw = await listTestimonials();

  const rows = rowsRaw.map((x) => ({
    id: x.id,
    rank: x.rank,
    title: x.authorName,
    extra1: truncate(x.message),
    extra2: x.authorRole ?? null,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderOrgTestimonials(items);
  }

  async function onDeleteAction(id: string) {
    'use server';
    await deleteOrgTestimonial(id);
  }

  return (
    <RankedList
      headerLabel="Testimonials"
      editBasePath="/dashboard/about/testimonials"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/testimonials/new"
      secondaryTextField="extra1"
      columns={{ nameLabel: 'Author', extra1Label: 'Message (truncated)', extra2Label: 'Role' }}
    />
  );
}

export default function TestimonialsPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
