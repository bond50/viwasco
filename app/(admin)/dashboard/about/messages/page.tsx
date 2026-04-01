import { Suspense } from 'react';
import { listMessages } from '@/lib/data/admin/about/content/messages';
import { deleteOrgMessage } from '@/actions/about/content/leadership/team-messages';
import { SimpleList, type SimpleRow } from '@/components/common/simple-list';

function Fallback() {
  return <div className="alert alert-info">Loading messages…</div>;
}

async function Content() {
  const rowsRaw = await listMessages();

  const rows: SimpleRow[] = rowsRaw.map((r) => ({
    id: r.id,
    title: r.title,
    extra1: r.authorTeam
      ? `${r.authorTeam.name} — ${r.authorTeam.position ?? 'Leader'} (Rank #${r.authorTeam.rank})`
      : null,
    extra2: r.published ? 'Published' : 'Draft',
  }));

  async function onDeleteAction(id: string) {
    'use server';
    await deleteOrgMessage(id);
  }

  return (
    <SimpleList
      headerLabel="Messages from Leadership"
      editBasePath="/dashboard/about/messages"
      rows={rows}
      onDeleteAction={onDeleteAction}
      addHref="/dashboard/about/messages/new"
      columns={{ nameLabel: 'Title', extra1Label: 'Leader', extra2Label: 'Status' }}
    />
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
