// app/(dashboard)/dashboard/about/faqs/page-seo.tsx
import { Suspense } from 'react';
import { deleteOrgFaq, reorderOrgFaqs } from '@/actions/about/content/faqs';
import { listFaqs } from '@/lib/data/admin/about/content/faqs';
import { RankedList } from '@/components/common/ranked-list';

function truncate(input: string, max = 120): string {
  if (!input) return '';
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1)}…`;
}

async function FaqsTable() {
  const rowsRaw = await listFaqs();
  const rows = rowsRaw.map((x) => ({
    id: x.id,
    rank: x.rank,
    title: x.question,
    extra1: x.answer ? truncate(x.answer) : null,
    extra2: null,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderOrgFaqs(items);
  }
  async function onDeleteAction(id: string) {
    'use server';
    await deleteOrgFaq(id);
  }

  return (
    <RankedList
      headerLabel="FAQs"
      editBasePath="/dashboard/about/faqs"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/faqs/new"
      secondaryTextField="extra1"
      columns={{ nameLabel: 'Question', extra1Label: 'Answer (truncated)', extra2Label: '—' }}
    />
  );
}

export default function FaqsPage() {
  return (
    <Suspense fallback={<div>Loading FAQs…</div>}>
      <FaqsTable />
    </Suspense>
  );
}
