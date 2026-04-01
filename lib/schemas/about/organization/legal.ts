import { z } from 'zod';

export const organisationLegalSchema = z.object({
  regulatorName: z.string().max(160).optional().nullable(),
  licenseNumber: z.string().max(120).optional().nullable(),
  licenseExpiry: z.date().optional().nullable(),
  customerCareHotline: z.string().max(60).optional().nullable(),
  whatsappNumber: z.string().max(60).optional().nullable(),
});

export type OrganisationLegalValues = z.infer<typeof organisationLegalSchema>;
