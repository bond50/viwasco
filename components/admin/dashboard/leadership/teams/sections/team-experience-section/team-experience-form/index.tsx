// components/admin/dashboard/leadership/teams/tabs/profile/forms/team-experience-form.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { Button } from '@/components/form-elements/button';
import { Switch } from '@/components/form-elements/switch';
import { CustomDatePicker } from '@/components/form-elements/date-picker';
import { FormError } from '@/components/form-error';
import ClipLoader from 'react-spinners/ClipLoader';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { ensureUploadedAsset } from '@/lib/assets/core';
import { saveTeamExperience } from '@/actions/about/content/leadership/team-experience';
import type { TeamExperienceFormValues } from '@/lib/schemas/about/content/leadership';

type Props = {
  teamId: string;
  initial?: TeamExperienceFormValues | null;
  closeAction: () => void;
};

type WithLogo = { logo?: unknown };

export function TeamExperienceForm({ teamId, initial, closeAction }: Props) {
  const router = useRouter();
  const { formAction, pending, getError, formError, state } =
    useFormAction<TeamExperienceFormValues>(saveTeamExperience, {
      successMessage: 'Saved experience',
      errorMessage: 'Failed to save',
    });

  useEffect(() => {
    if (!state?.success) return;
    closeAction();
    router.refresh();
  }, [closeAction, router, state?.success]);

  const current: TeamExperienceFormValues | null =
    (state?.values as TeamExperienceFormValues | null) ?? initial ?? null;

  const logoSourceState = state?.values as (TeamExperienceFormValues & WithLogo) | undefined;
  const logoSourceInitial = initial as (TeamExperienceFormValues & WithLogo) | undefined;
  const logoDefault = ensureUploadedAsset(logoSourceState?.logo ?? logoSourceInitial?.logo);

  const achievementsArray: string[] = Array.isArray(current?.achievements)
    ? (current.achievements as string[])
    : [];

  return (
    <CardWrapper2 headerLabel={current?.id ? 'Edit Experience' : 'Add Experience'}>
      <form action={formAction} className="row g-3">
        <input type="hidden" name="teamId" value={teamId} />
        {current?.id && <input type="hidden" name="id" value={current.id} />}

        {/* Role */}
        <div className="col-12 col-md-6">
          <Input
            name="role"
            label="Role *"
            placeholder="e.g., Senior Engineer"
            defaultValue={current?.role ?? ''}
            error={getError('role')}
          />
        </div>

        {/* Organization */}
        <div className="col-12 col-md-6">
          <Input
            name="organization"
            label="Organization"
            placeholder="e.g., Nairobi Water"
            defaultValue={current?.organization ?? ''}
          />
        </div>

        {/* Start Date */}
        <div className="col-12 col-md-6">
          <CustomDatePicker
            name="startDate"
            label="Start Date"
            placeholder="Pick start date"
            defaultValue={current?.startDate ?? null}
            error={getError('startDate')}
          />
        </div>

        {/* End Date */}
        <div className="col-12 col-md-6">
          <CustomDatePicker
            name="endDate"
            label="End Date"
            placeholder="Pick end date"
            defaultValue={current?.endDate ?? null}
            error={getError('endDate')}
          />
        </div>

        {/* Is current */}
        <div className="col-12">
          <Switch
            name="isCurrent"
            label="Currently Employed?"
            defaultChecked={Boolean(current?.isCurrent)}
          />
        </div>

        {/* Description */}
        <div className="col-12">
          <Input
            name="description"
            label="Description"
            as="textarea"
            placeholder="Short summary of responsibilities"
            defaultValue={current?.description ?? ''}
          />
        </div>

        {/* Achievements */}
        <div className="col-12">
          <Input
            name="achievements"
            label="Achievements"
            placeholder="Comma-separated e.g. 'Improved revenue collection, Led automation…'"
            defaultValue={achievementsArray.join(', ')}
          />
        </div>

        {/* Logo */}
        <div className="col-12 col-md-6">
          <FileDropzone
            mode="image"
            name="logo"
            label="Organization Logo"
            folder="leadership/experience"
            defaultValue={logoDefault}
          />
        </div>

        <FormError message={formError ?? undefined} />

        <div className="d-flex gap-2 mt-2">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? (
              <>
                <ClipLoader size={16} /> Saving…
              </>
            ) : (
              'Save'
            )}
          </Button>

          <Button type="button" variant="outline-primary" onClick={closeAction}>
            Cancel
          </Button>
        </div>
      </form>
    </CardWrapper2>
  );
}
