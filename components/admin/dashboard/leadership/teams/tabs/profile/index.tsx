// components/admin/dashboard/leadership/teams/tabs/profile.tsx
'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { Input } from '@/components/form-elements/input';
import { RichTextEditor } from '@/components/form-elements/rich-text-editor';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import type { TeamSettingsData } from '@/lib/types/about/leadership';
import type { ManagementTeamProfileValues } from '@/lib/schemas/about/content/leadership';
import { updateTeamMemberProfile } from '@/actions/about/content/leadership';
import { TeamEducationSection } from '@/components/admin/dashboard/leadership/teams/sections/team-education-section';

type Props = { team: TeamSettingsData };

export function TeamProfileTab({ team }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ManagementTeamProfileValues>(updateTeamMemberProfile.bind(null, team.id), {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    });

  const bio = (state?.values?.bio as string | undefined) ?? team.profile.bio ?? '';

  const educationLegacy =
    (state?.values?.education as string | undefined) ?? team.profile.education ?? '';

  const experience =
    (state?.values?.experience as string | undefined) ?? team.profile.experience ?? '';

  const achievements =
    (state?.values?.achievements as string | undefined) ?? team.profile.achievements ?? '';

  const publications = state?.values?.publications ?? team.profile.publications ?? null;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Main profile text fields (still monolithic for now) */}
      <form action={formAction}>
        <div className="mb-3">
          <RichTextEditor
            name="bio"
            label="Bio *"
            defaultValue={bio}
            placeholder="Brief professional biography…"
          />
          {getError('bio') ? (
            <div className="invalid-feedback d-block mt-1">{getError('bio')}</div>
          ) : null}
        </div>

        <div className="row mb-3 g-3">
          <div className="col-md-4">
            <Input
              name="education"
              label="Education (legacy)"
              as="textarea"
              defaultValue={educationLegacy}
              error={getError('education')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="experience"
              label="Experience"
              as="textarea"
              defaultValue={experience}
              error={getError('experience')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="achievements"
              label="Key Achievements"
              as="textarea"
              defaultValue={achievements}
              error={getError('achievements')}
            />
          </div>
        </div>

        <div className="mb-3">
          <Input
            name="publications"
            label="Publications (JSON, optional)"
            as="textarea"
            placeholder='[{"title":"Paper","year":2024}]'
            defaultValue={publications != null ? JSON.stringify(publications) : ''}
            error={getError('publications')}
          />
        </div>

        <FormError message={formError ?? undefined} />
        <SaveUpdateButton isEdit pending={pending} variant="primary" />
      </form>

      {/* New relational education section */}
      <TeamEducationSection teamId={team.id} educations={team.educations ?? []} />
    </div>
  );
}
