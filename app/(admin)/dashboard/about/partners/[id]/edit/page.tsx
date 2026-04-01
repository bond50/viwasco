// app/(dashboard)/dashboard/about/partners/[id]/edit/page-seo.tsx
import { notFound } from 'next/navigation';

import type { PartnershipType } from '@/lib/schemas/about/content/partners';
import { getPartnerById } from '@/lib/data/admin/about/content/parners';
import { PartnerEditForm } from '@/components/admin/dashboard/partners/partners-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditPartnerPage({ params }: Props) {
  const { id } = await params;
  const row = await getPartnerById(id);
  if (!row) return notFound();

  return (
    <PartnerEditForm
      row={{
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        website: row.website,
        partnershipType: row.partnershipType as unknown as PartnershipType,
        logo: row.logo,
        isActive: row.isActive,
      }}
    />
  );
}
