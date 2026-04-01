'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { RichTextEditor } from '@/components/form-elements/rich-text-editor';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import type { TeamSettingsData } from '@/lib/types/about/leadership';
import { updateTeamBio } from '@/actions/about/content/leadership/team-bio';

type Props = { team: TeamSettingsData };

export function TeamProfileBioSection({ team }: Props) {
  const { formAction, getError, pending, state, formError } = useFormAction(
    updateTeamBio.bind(null, team.id),
    {
      successMessage: 'Bio updated',
      errorMessage: 'Failed to update bio',
    },
  );

  const bio = state?.values?.bio ?? team.profile.bio ?? '';

  return (
    <form action={formAction} className="card card-body">
      <RichTextEditor
        name="bio"
        label="Biography"
        defaultValue={bio}
        placeholder="Write a detailed professional biography…"
        error={getError('bio')}
      />
      <FormError message={formError ?? undefined} />
      <SaveUpdateButton pending={pending} variant="primary" isEdit />
    </form>
  );
}
