import { z } from 'zod';
import { isValidUrl } from '@/lib/utils';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';
import { emailSchema } from '@/lib/schemas/auth';
import { socialLinksSchema } from '@/lib/schemas/shared/social';
import { workingHoursSchema } from '@/lib/schemas/shared/working-hours';
import { optionalUrlString, requiredObject, requiredText } from '@/lib/schemas/shared/helpers';

export const organizationSchema = z.object({
  id: z.string().optional().nullable(),

  // Basic
  name: requiredText('Name', 2),
  slug: z.string().optional().nullable(),
  description: z
    .string()
    .max(2000, { message: 'Description must be at most 2000 characters' })
    .optional()
    .nullable(),
  tagline: z
    .string()
    .max(200, { message: 'Tagline must be at most 200 characters' })
    .optional()
    .nullable(),
  shortName: z
    .string()
    .max(200, { message: 'Short name must be at most 200 characters' })
    .optional()
    .nullable(),

  // Introduction
  introTitle: z
    .string()
    .max(160, { message: 'Introduction title must be at most 160 characters' })
    .optional()
    .nullable(),
  introDescription: z
    .string()
    .max(2000, { message: 'Introductory description must be at most 2000 characters' })
    .optional()
    .nullable(),

  // Vision / Mission
  vision: z
    .string()
    .max(2000, { message: 'Vision must be at most 2000 characters' })
    .optional()
    .nullable(),
  mission: z
    .string()
    .max(2000, { message: 'Mission must be at most 2000 characters' })
    .optional()
    .nullable(),
  coreValuesLeadText: z
    .string()
    .max(1000, { message: 'Lead text must be at most 1000 characters' })
    .optional()
    .nullable(),
  visionIcon: z
    .string()
    .max(120, { message: 'Vision icon key must be at most 120 characters' })
    .optional()
    .nullable(),
  missionIcon: z
    .string()
    .max(120, { message: 'Mission icon key must be at most 120 characters' })
    .optional()
    .nullable(),

  // Contact
  websiteUrl: optionalUrlString(isValidUrl),
  contactEmail: emailSchema, // already gives "Email is required" / "Enter a valid email address"
  phone: z
    .string()
    .max(60, { message: 'Phone must be at most 60 characters' })
    .optional()
    .nullable(),
  address: z
    .string()
    .max(240, { message: 'Address must be at most 240 characters' })
    .optional()
    .nullable(),

  // Legal / utility
  regulatorName: z
    .string()
    .max(160, { message: 'Regulator name must be at most 160 characters' })
    .optional()
    .nullable(),
  licenseNumber: z
    .string()
    .max(120, { message: 'License number must be at most 120 characters' })
    .optional()
    .nullable(),
  licenseExpiry: z.date().optional().nullable(),
  customerCareHotline: z
    .string()
    .max(60, { message: 'Hotline must be at most 60 characters' })
    .optional()
    .nullable(),
  whatsappNumber: z
    .string()
    .max(60, { message: 'WhatsApp number must be at most 60 characters' })
    .optional()
    .nullable(),

  // Media (optional here; enforced in create schema)
  logo: uploadedImageResponseSchema.optional().nullable(),
  featuredImage: uploadedImageResponseSchema.optional().nullable(),
  bannerImage: uploadedImageResponseSchema.optional().nullable(),
  coreValuesImage: uploadedImageResponseSchema.optional().nullable(),
  introImage: uploadedImageResponseSchema.optional().nullable(),

  // Misc
  socialLinks: socialLinksSchema.nullable().optional(),
  workingHours: workingHoursSchema.nullable().optional(),
});

// On CREATE, make media required with friendly messages
export const organizationCreateSchema = organizationSchema.extend({
  logo: requiredObject(uploadedImageResponseSchema, 'Logo'),
  featuredImage: requiredObject(uploadedImageResponseSchema, 'Featured image'),
});
