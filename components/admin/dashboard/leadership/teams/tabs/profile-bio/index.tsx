'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { RichTextEditor } from '@/components/form-elements/rich-text-editor';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { FormError } from '@/components/form-error';
import type { TeamSettingsData } from '@/lib/types/about/leadership';
import { updateTeamBio } from '@/actions/about/content/leadership/team-bio';

type Props = { team: TeamSettingsData };

export function TeamBioTab({ team }: Props) {
  const { formAction, pending, state, getError, formError } = useFormAction(
    updateTeamBio.bind(null, team.id),
    {
      successMessage: 'Bio saved',
      errorMessage: 'Failed to save bio',
    },
  );

  const bio = state?.values?.bio ?? team.profile.bio ?? '';

  return (
    <form action={formAction} className="d-flex flex-column gap-4">
      <div>
        <RichTextEditor name="bio" label="Biography *" defaultValue={bio} />
        {getError('bio') && <div className="invalid-feedback d-block">{getError('bio')}</div>}
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} />
    </form>
  );
}
