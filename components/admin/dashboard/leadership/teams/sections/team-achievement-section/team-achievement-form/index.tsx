// components/admin/dashboard/leadership/teams/tabs/profile/forms/team-achievement-form.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { Button } from '@/components/form-elements/button';
import { FormError } from '@/components/form-error';
import ClipLoader from 'react-spinners/ClipLoader';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { ensureUploadedAsset } from '@/lib/assets/core';
import { saveTeamAchievement } from '@/actions/about/content/leadership/team-achievement';
import type { TeamAchievementFormValues } from '@/lib/schemas/about/content/leadership';

type Props = {
  initial?: TeamAchievementFormValues | null;
  teamId: string;
  closeAction: () => void;
};

type WithLogo = { logo?: unknown };

export function TeamAchievementForm({ initial, teamId, closeAction }: Props) {
  const router = useRouter();
  const { formAction, pending, getError, formError, state } =
    useFormAction<TeamAchievementFormValues>(saveTeamAchievement, {
      successMessage: 'Saved achievement',
      errorMessage: 'Failed to save achievement',
    });

  useEffect(() => {
    if (!state?.success) return;
    closeAction();
    router.refresh();
  }, [closeAction, router, state?.success]);

  const current = state?.values ?? initial ?? null;
  const isEditing = Boolean(current?.id);

  const logoSourceState = state?.values as (TeamAchievementFormValues & WithLogo) | undefined;
  const logoSourceInitial = initial as (TeamAchievementFormValues & WithLogo) | undefined;
  const logoDefault = ensureUploadedAsset(logoSourceState?.logo ?? logoSourceInitial?.logo);

  return (
    <CardWrapper2 headerLabel={isEditing ? 'Edit Achievement' : 'Add Achievement'}>
      <form action={formAction} className="row g-3">
        {/* Hidden identifiers */}
        <input type="hidden" name="teamId" value={teamId} />
        {current?.id && <input type="hidden" name="id" value={current.id} />}

        {/* Title + Year */}
        <div className="col-12 col-md-8">
          <Input
            name="title"
            label="Achievement Title *"
            placeholder="e.g., Winner – National Water Innovation Award"
            defaultValue={current?.title ?? ''}
            error={getError('title')}
          />
        </div>

        <div className="col-12 col-md-4">
          <Input
            name="year"
            type="number"
            label="Year"
            placeholder="e.g., 2024"
            defaultValue={current?.year?.toString() ?? ''}
          />
        </div>

        {/* Issuer */}
        <div className="col-12 col-md-6">
          <Input
            name="issuer"
            label="Issuer / Organization"
            placeholder="e.g., Water Services Providers Association"
            defaultValue={current?.issuer ?? ''}
          />
        </div>

        {/* Logo */}
        <div className="col-12 col-md-6">
          <FileDropzone
            mode="image"
            name="logo"
            label="Award Logo"
            folder="leadership/achievements"
            defaultValue={logoDefault}
          />
        </div>

        {/* Description */}
        <div className="col-12">
          <Input
            name="description"
            label="Description (optional)"
            as="textarea"
            placeholder="Brief context—project, scope, impact…"
            defaultValue={current?.description ?? ''}
          />
        </div>

        <div className="col-12">
          <FormError message={formError ?? undefined} />
        </div>

        <div className="col-12 d-flex justify-content-end gap-2 mt-1">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? (
              <>
                <ClipLoader size={16} /> Saving…
              </>
            ) : (
              'Save achievement'
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
