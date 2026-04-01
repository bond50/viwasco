import { listLeadersForSelect } from '@/lib/data/admin/about/content/messages';
import { MessageCreateForm } from '@/components/admin/dashboard/messages/message-form';

export default async function NewMessagePage() {
  const options = await listLeadersForSelect();
  return <MessageCreateForm leaderOptions={options} />;
}
