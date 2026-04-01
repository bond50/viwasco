import Link from 'next/link';
import { revalidatePath, revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { after } from 'next/server';

import { CardWrapper2 } from '@/components/card/card-2';
import { Button } from '@/components/form-elements/button';
import { CONTACT_MESSAGES_TAG } from '@/lib/cache/tags';
import { getContactMessageById } from '@/lib/data/admin/contact-messages';
import { db } from '@/lib/db';

type PageProps = { params: Promise<{ id: string }> };

export default async function ContactMessagePage({ params }: PageProps) {
  const { id } = await params;
  const row = await getContactMessageById(id);
  if (!row) return notFound();

  if (row.status === 'NEW') {
    after(async () => {
      await db.contactMessage.updateMany({
        where: { id, deleted_at: null, status: 'NEW' },
        data: { status: 'IN_PROGRESS' },
      });

      revalidatePath('/dashboard/contact-messages');
      revalidateTag(CONTACT_MESSAGES_TAG, 'max');
    });
  }

  return (
    <CardWrapper2
      headerLabel={row.subject}
      headerActions={
        <Link href="/dashboard/contact-messages">
          <Button variant="outline-primary" size="small">
            All Messages
          </Button>
        </Link>
      }
    >
      <div className="row g-3">
        <div className="col-md-6">
          <strong>Name:</strong> {row.full_name}
        </div>
        <div className="col-md-6">
          <strong>Email:</strong> {row.email}
        </div>
        <div className="col-md-6">
          <strong>Phone:</strong> {row.phone ?? '-'}
        </div>
        <div className="col-md-6">
          <strong>Type:</strong> {row.contact_type}
        </div>
        <div className="col-md-6">
          <strong>Status:</strong> {row.status === 'NEW' ? 'IN_PROGRESS' : row.status}
        </div>
        <div className="col-md-6">
          <strong>Created:</strong> {new Date(row.created_at).toLocaleString('en-KE')}
        </div>
        <div className="col-md-6">
          <strong>Account Number:</strong> {row.account_number ?? '-'}
        </div>
        <div className="col-md-6">
          <strong>Service Area:</strong> {row.service_area ?? '-'}
        </div>
        <div className="col-md-6">
          <strong>Reference:</strong> {row.reference ?? '-'}
        </div>
        <div className="col-12">
          <strong>Message:</strong>
          <div className="mt-2 border rounded p-3 bg-light" style={{ whiteSpace: 'pre-wrap' }}>
            {row.message}
          </div>
        </div>
      </div>
    </CardWrapper2>
  );
}
