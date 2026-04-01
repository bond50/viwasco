import { z } from 'zod';
import { emailSchema } from '@/lib/schemas/auth';
import { isValidUrl } from '@/lib/utils';
import { requiredText } from '@/lib/schemas/shared/helpers';

const navigationVisibilitySchema = z.object({
  about: z.boolean().optional(),
  services: z.boolean().optional(),
  projects: z.boolean().optional(),
  resources: z.boolean().optional(),
  news: z.boolean().optional(),
  tenders: z.boolean().optional(),
  careers: z.boolean().optional(),
  newsletters: z.boolean().optional(),
  contact: z.boolean().optional(),
});

const urlSchema = z
  .string()
  .optional()
  .nullable()
  .refine((v) => !v || isValidUrl(v), { message: 'Invalid URL' });

const formCheckboxBoolean = z.preprocess((value) => {
  if (typeof value === 'boolean') return value;
  if (value === 'on') return true;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (typeof value === 'undefined') return false;
  return value;
}, z.boolean());

const recipientEmailSchema = z.email().trim().toLowerCase();

export const organisationContactSchema = z.object({
  websiteUrl: urlSchema,
  contactEmail: emailSchema,
  contactRecipientEmails: z.array(recipientEmailSchema).optional().nullable(),
  phone: z.string().max(60).optional().nullable(),
  address: z.string().max(240).optional().nullable(),
  footerAboutText: z
    .string()
    .max(2000, { message: 'Footer about text must be at most 2000 characters' })
    .optional()
    .nullable(),
  customerPortalEnabled: formCheckboxBoolean.optional(),
  customerPortalLabel: z
    .string()
    .max(120, { message: 'Portal label must be at most 120 characters' })
    .optional()
    .nullable(),
  customerPortalUrl: urlSchema,
  navigationVisibility: navigationVisibilitySchema.optional().nullable(),
  serviceCentres: z
    .array(
      z.object({
        name: requiredText('Service centre name', 2),
        address: requiredText('Service centre address', 2),
      }),
    )
    .optional()
    .nullable(),
});

export type OrganisationContactValues = z.infer<typeof organisationContactSchema>;
