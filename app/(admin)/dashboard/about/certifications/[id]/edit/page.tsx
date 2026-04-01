import { CertificationEditForm } from '@/components/admin/dashboard/certifications/certification-form';
import { getCertificationById } from '@/lib/data/admin/about/content/certification';

type Props = { params: Promise<{ id: string }> };

export default async function EditCertificationPage({ params }: Props) {
  const { id } = await params;
  const cert = await getCertificationById(id);
  if (!cert) throw new Error('Certification not found');

  return <CertificationEditForm cert={cert} />;
}
