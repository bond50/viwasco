import { notFound } from 'next/navigation';
import { getMessageById, listLeadersForSelect } from '@/lib/data/admin/about/content/messages';
import { MessageEditForm } from '@/components/admin/dashboard/messages/message-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditMessagePage({ params }: Props) {
  const { id } = await params;
  const row = await getMessageById(id);
  if (!row) return notFound();
  const options = await listLeadersForSelect();
  return <MessageEditForm message={row} leaderOptions={options} />;
}
