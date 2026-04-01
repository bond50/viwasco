// actions/organization/vision-mission.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import type { ActionState } from '@/lib/types/action-state';
import {
  organisationVisionMissionSchema,
  type OrganisationVisionMissionValues,
} from '@/lib/schemas/about/organization/vision-mission';
import { ORG_VISION_MISSION_TAG } from '@/lib/cache/tags';

export async function updateOrganizationVisionMission(
  orgId: string,
  _prev: ActionState<OrganisationVisionMissionValues>,
  formData: FormData,
) {
  if (!orgId) throw new Error('Missing organization id.');

  return executeAction<OrganisationVisionMissionValues>({
    schema: organisationVisionMissionSchema,
    formData,
    execute: async (data) => {
      const patch: Prisma.OrganizationUpdateInput = {};
      if (typeof data.vision !== 'undefined') patch.vision = data.vision;
      if (typeof data.mission !== 'undefined') patch.mission = data.mission;
      if (typeof data.visionIcon !== 'undefined') patch.visionIcon = data.visionIcon;
      if (typeof data.missionIcon !== 'undefined') patch.missionIcon = data.missionIcon;

      await db.organization.update({ where: { id: orgId }, data: patch });
    },
    revalidateTags: [ORG_VISION_MISSION_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
