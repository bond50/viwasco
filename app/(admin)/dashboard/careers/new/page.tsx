import { CareerCreateForm } from '@/components/admin/dashboard/careers/career-form';
import { listCareerTypes } from '@/lib/data/admin/careers/types';

export default async function NewCareerPage() {
  const typesRaw = await listCareerTypes();
  const types = typesRaw.map((type) => ({ id: type.id, slug: type.slug, label: type.name }));
  return <CareerCreateForm types={types} />;
}
