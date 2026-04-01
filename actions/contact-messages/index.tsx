'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { validateWithZod } from '@/lib/actions/core/validation';
import { mapPrismaKnownRequestError, mapUnknownError } from '@/lib/actions/core/errors';
import type { ActionState } from '@/lib/types/action-state';
import { type ContactMessageFormValues, contactMessageSchema } from '@/lib/schemas/contact';
import { sendEmail } from '@/lib/email/resend';
import { ContactMessageEmail } from '@/components/emails/contact-message';
import { CONTACT_MESSAGES_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';
import { verifyTurnstileToken } from '@/lib/security/verify-turnstile';

const REVALIDATE_DASHBOARD = '/dashboard/contact-messages';

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function getBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}

function normalizeEmailList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return Array.from(
    new Set(
      input
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim().toLowerCase())
        .filter((value) => value.length > 0),
    ),
  );
}

async function getNotificationRecipients(): Promise<string[] | null> {
  const org = await db.organization.findFirst({
    where: { isActive: true },
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    select: { contactEmail: true, metadata: true },
  });

  const metadata =
    org?.metadata && typeof org.metadata === 'object'
      ? (org.metadata as Record<string, unknown>)
      : {};
  const metadataRecipients = normalizeEmailList(metadata.contactMessageRecipients);

  if (metadataRecipients.length > 0) return metadataRecipients;
  if (org?.contactEmail) return [org.contactEmail];

  const fallback = [process.env.CONTACT_EMAIL, process.env.EMAIL_REPLY_TO].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  );

  return fallback.length > 0 ? Array.from(new Set(fallback)) : null;
}

function revalidateContactMessages() {
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(CONTACT_MESSAGES_TAG, 'max');
}

export async function markContactMessageRead(id: string) {
  await requireCurrentUser();

  await db.contactMessage.updateMany({
    where: { id, deleted_at: null, status: 'NEW' },
    data: { status: 'IN_PROGRESS' },
  });

  revalidateContactMessages();
}

export async function markAllContactMessagesRead() {
  await requireCurrentUser();

  await db.contactMessage.updateMany({
    where: { deleted_at: null, status: 'NEW' },
    data: { status: 'IN_PROGRESS' },
  });

  revalidateContactMessages();
}

export const submitContactMessage = async (
  _prev: ActionState<ContactMessageFormValues>,
  formData: FormData,
): Promise<ActionState<ContactMessageFormValues>> => {
  const parsedData = {
    contactType: getString(formData, 'contactType').toUpperCase(),
    fullName: getString(formData, 'fullName'),
    email: getString(formData, 'email'),
    phone: getString(formData, 'phone') || null,
    subject:
      getString(formData, 'subject') ||
      (getString(formData, 'contactType').toUpperCase() === 'COMPLAINT' ? 'Service complaint' : ''),
    accountNumber: getString(formData, 'accountNumber') || null,
    serviceArea: getString(formData, 'serviceArea') || null,
    reference: getString(formData, 'reference') || null,
    message: getString(formData, 'message'),
    consent: getBoolean(formData, 'consent'),
  };

  const turnstileToken = getString(formData, 'cf-turnstile-response');

  const validation = await validateWithZod(contactMessageSchema, parsedData);
  if (!validation.ok) return validation.result;

  const data = validation.data;
  const turnstileVerification = await verifyTurnstileToken(turnstileToken);

  if (!turnstileVerification.success) {
    return {
      success: false,
      errors: {
        _form: [turnstileVerification.message],
      },
      values: data,
    };
  }

  try {
    const row = await db.contactMessage.create({
      data: {
        contact_type: data.contactType,
        full_name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        subject: data.subject.trim(),
        account_number: data.accountNumber?.trim() || null,
        service_area: data.serviceArea?.trim() || null,
        reference: data.reference?.trim() || null,
        message: data.message.trim(),
        consent: Boolean(data.consent),
        status: 'NEW',
      },
      select: { id: true },
    });

    const notificationTo = await getNotificationRecipients();
    if (!notificationTo || notificationTo.length === 0) {
      throw new Error('Contact recipient email is not configured.');
    }

    await sendEmail({
      to: notificationTo,
      subject: `[Contact] ${data.subject}`,
      replyTo: data.email,
      suppressReplies: false,
      react: (
        <ContactMessageEmail
          title="New Contact Message"
          intro="A new message was submitted from the public contact form."
          fullName={data.fullName}
          email={data.email}
          phone={data.phone}
          subject={data.subject}
          contactType={data.contactType}
          message={data.message}
          accountNumber={data.accountNumber}
          serviceArea={data.serviceArea}
          reference={data.reference}
        />
      ),
    });

    await db.contactMessage.update({
      where: { id: row.id },
      data: { notified_at: new Date() },
    });

    revalidateContactMessages();

    return {
      success: true,
      values: data,
    };
  } catch (error) {
    const prismaMapped = mapPrismaKnownRequestError<ContactMessageFormValues>(error, data);
    if (prismaMapped) return prismaMapped;
    return mapUnknownError<ContactMessageFormValues>(error, data);
  }
};
