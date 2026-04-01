// lib/types/organisation/organization.ts
import type { z } from 'zod';
import {
  organizationCreateSchema,
  organizationSchema,
} from '@/lib/schemas/about/organization/organization';

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
export type OrganizationCreateValues = z.infer<typeof organizationCreateSchema>;
