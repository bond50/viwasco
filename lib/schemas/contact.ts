import { z } from 'zod';

export const contactMessageSchema = z.object({
  contactType: z.enum(['ENQUIRY', 'COMPLAINT']),
  fullName: z.string().min(2).max(160),
  email: z.string().email(),
  phone: z.string().max(60).optional().nullable(),
  subject: z.string().min(2).max(220),
  accountNumber: z.string().max(120).optional().nullable(),
  serviceArea: z.string().max(160).optional().nullable(),
  reference: z.string().max(120).optional().nullable(),
  message: z.string().min(10).max(4000),
  consent: z.boolean().refine((value) => value, { message: 'Consent is required' }),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;
