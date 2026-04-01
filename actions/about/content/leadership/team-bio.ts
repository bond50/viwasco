'use server';

import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';
import { TeamBioFormValues, teamBioSchema } from '@/lib/schemas/about/content/leadership';
import { ActionState } from '@/lib/types/action-state';

export const updateTeamBio = async (
  id: string,
  _prev: ActionState<TeamBioFormValues>,
  formData: FormData,
) => {
  return executeAction<TeamBioFormValues>({
    schema: teamBioSchema,
    formData,
    execute: async (data) => {
      await db.managementTeam.update({
        where: { id },
        data: {
          bio: data.bio,
        },
      });
    },
    revalidatePaths: [TEAM_REVALIDATE_PATH],
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
  });
};
