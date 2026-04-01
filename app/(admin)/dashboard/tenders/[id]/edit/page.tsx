import { notFound } from 'next/navigation';
import { TenderEditForm } from '@/components/admin/dashboard/tenders/tender-form';
import { getTenderById } from '@/lib/data/admin/tenders';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTenderPage({ params }: PageProps) {
  const { id } = await params;
  const row = await getTenderById(id);
  if (!row) return notFound();
  return (
    <TenderEditForm
      row={{ ...row, file: row.file, status: row.status as 'OPEN' | 'AWARDED' | 'ARCHIVED' }}
    />
  );
}
