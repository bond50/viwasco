import { notFound } from 'next/navigation';
import { CareerEditForm } from '@/components/admin/dashboard/careers/career-form';
import { getCareerById } from '@/lib/data/admin/careers';
import { listCareerTypes } from '@/lib/data/admin/careers/types';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCareerPage({ params }: PageProps) {
  const { id } = await params;
  const [row, typesRaw] = await Promise.all([getCareerById(id), listCareerTypes()]);
  if (!row) return notFound();
  const types = typesRaw.map((type) => ({ id: type.id, slug: type.slug, label: type.name }));
  return <CareerEditForm row={{ ...row, file: row.file }} types={types} />;
}
