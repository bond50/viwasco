import { notFound } from 'next/navigation';
import { CareerTypeEditForm } from '@/components/admin/dashboard/careers/career-type-form';
import { getCareerTypeById } from '@/lib/data/admin/careers/types';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCareerTypePage({ params }: PageProps) {
  const { id } = await params;
  const row = await getCareerTypeById(id);
  if (!row) return notFound();
  return <CareerTypeEditForm row={row} />;
}
