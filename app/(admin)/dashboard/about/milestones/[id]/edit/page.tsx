import { notFound } from 'next/navigation';
import { getMilestoneById } from '@/lib/data/admin/about/content/milestones';
import { MilestoneEditForm } from '@/components/admin/dashboard/milestones/milestone-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditMilestonePage({ params }: Props) {
  const { id } = await params;
  const row = await getMilestoneById(id);
  if (!row) return notFound();

  return <MilestoneEditForm milestone={row} />;
}
