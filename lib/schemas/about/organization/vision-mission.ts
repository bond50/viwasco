import { z } from 'zod';

export const organisationVisionMissionSchema = z.object({
  vision: z.string().max(2000).optional().nullable(),
  mission: z.string().max(2000).optional().nullable(),
  visionIcon: z.string().max(120).optional().nullable(),
  missionIcon: z.string().max(120).optional().nullable(),
});

export type OrganisationVisionMissionValues = z.infer<typeof organisationVisionMissionSchema>;
