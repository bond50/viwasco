// app/(dashboard)/dashboard/about/certifications/page-seo.tsx
import { Suspense } from 'react';
import {
  deleteOrgCertification,
  reorderOrgCertifications,
} from '@/actions/about/content/certifications';
import { RankedList } from '@/components/common/ranked-list';
import { listCertifications } from '@/lib/data/admin/about/content/certification';

async function CertificationsTable() {
  const rowsRaw = await listCertifications();
  const rows = rowsRaw.map((x) => ({
    id: x.id,
    rank: x.rank,
    title: x.name,
    extra1: x.issuingAuthority ?? null,
    extra2: x.expiryDate
      ? `Expires ${new Date(x.expiryDate).toDateString()}`
      : x.issueDate
        ? `Issued ${new Date(x.issueDate).toDateString()}`
        : null,
  }));

  async function onReorderAction(items: { id: string; rank: number }[]) {
    'use server';
    await reorderOrgCertifications(items);
  }
  async function onDeleteAction(id: string) {
    'use server';
    await deleteOrgCertification(id);
  }

  return (
    <RankedList
      headerLabel="Certifications"
      editBasePath="/dashboard/about/certifications"
      rows={rows}
      onDeleteAction={onDeleteAction}
      onReorderAction={onReorderAction}
      addHref="/dashboard/about/certifications/new"
      secondaryTextField="extra1"
      columns={{ nameLabel: 'Certification', extra1Label: 'Authority', extra2Label: 'Dates' }}
    />
  );
}

export default function CertificationsPage() {
  return (
    <Suspense fallback={<div>Loading certifications…</div>}>
      <CertificationsTable />
    </Suspense>
  );
}
