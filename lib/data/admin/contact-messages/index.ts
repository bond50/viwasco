import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { CONTACT_MESSAGES_TAG } from '@/lib/cache/tags';

export type AdminContactMessageRow = {
  id: string;
  contact_type: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  account_number: string | null;
  service_area: string | null;
  reference: string | null;
  message: string;
  consent: boolean;
  status: string;
  notified_at: Date | null;
  responded_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export async function listContactMessages(): Promise<AdminContactMessageRow[]> {
  return db.contactMessage.findMany({
    where: { deleted_at: null },
    orderBy: [{ created_at: 'desc' }],
    select: {
      id: true,
      contact_type: true,
      full_name: true,
      email: true,
      phone: true,
      subject: true,
      account_number: true,
      service_area: true,
      reference: true,
      message: true,
      consent: true,
      status: true,
      notified_at: true,
      responded_at: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export type AdminContactMessageById = AdminContactMessageRow;

export async function getContactMessageById(id: string): Promise<AdminContactMessageById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(CONTACT_MESSAGES_TAG);

  return db.contactMessage.findUnique({
    where: { id },
    select: {
      id: true,
      contact_type: true,
      full_name: true,
      email: true,
      phone: true,
      subject: true,
      account_number: true,
      service_area: true,
      reference: true,
      message: true,
      consent: true,
      status: true,
      notified_at: true,
      responded_at: true,
      created_at: true,
      updated_at: true,
    },
  });
}
