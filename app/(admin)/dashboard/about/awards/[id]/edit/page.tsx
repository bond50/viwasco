import { notFound } from 'next/navigation';
import { getAwardById } from '@/lib/data/admin/about/content/awards';
import { AwardEditForm } from '@/components/admin/dashboard/awards/award-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditAwardPage({ params }: Props) {
  const { id } = await params;
  const award = await getAwardById(id);
  if (!award) return notFound();

  return <AwardEditForm award={award} />;
}
