import { z } from 'zod';
import {
  orgAwardSchema,
  orgCertificationSchema,
  orgFaqSchema,
  orgMilestoneSchema,
  orgTestimonialSchema,
} from '@/lib/schemas/about';

import { orgMetricSchema } from '@/lib/schemas/about/content/metrics';
import { orgMessageSchema } from '@/lib/schemas/about/content/messages';
import {
  managementCategorySchema,
  managementTeamSchema,
} from '@/lib/schemas/about/content/leadership';

export type ManagementCategoryFormValues = z.infer<typeof managementCategorySchema>;
export type ManagementTeamFormValues = z.infer<typeof managementTeamSchema>;
export type OrgMetricFormValues = z.infer<typeof orgMetricSchema>;
export type OrgMessageFormValues = z.infer<typeof orgMessageSchema>;
export type OrgFaqFormValues = z.infer<typeof orgFaqSchema>;
export type OrgMilestoneFormValues = z.infer<typeof orgMilestoneSchema>;
export type OrgAwardFormValues = z.infer<typeof orgAwardSchema>;
export type OrgCertificationFormValues = z.infer<typeof orgCertificationSchema>;
export type OrgTestimonialFormValues = z.infer<typeof orgTestimonialSchema>;
