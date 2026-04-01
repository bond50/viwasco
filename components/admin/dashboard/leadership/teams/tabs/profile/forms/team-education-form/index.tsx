'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Button } from '@/components/form-elements/button';
import { Input } from '@/components/form-elements/input';
import { Switch } from '@/components/form-elements/switch';
import { FormError } from '@/components/form-error';
import ClipLoader from 'react-spinners/ClipLoader';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { CustomDatePicker } from '@/components/form-elements/date-picker';
import { Select } from '@/components/form-elements/select';

import { ensureUploadedAsset } from '@/lib/assets/core';
import type { GenericOption } from '@/components/form-elements/select/types';
import { saveTeamEducation } from '@/actions/about/content/leadership/team-education';
import {
  TeamEducationFormValues,
  type TeamEducationLevel,
  teamEducationLevelValues,
} from '@/lib/schemas/about/content/leadership';

type EducationInitial = {
  id?: string;
  teamId: string;
  institution: string;
  qualification?: string | null;
  level?: TeamEducationLevel | null;
  field?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
  logo?: unknown;
  honor?: string | null;
};

type Props = {
  teamId: string;
  initial?: EducationInitial | null;
  closeAction: () => void;
};

// Use string as the GenericOption value for compatibility with your <Select>
const LEVEL_OPTIONS: GenericOption<string>[] = teamEducationLevelValues.map((v) => ({
  value: v, // Prisma enum string e.g. "BACHELORS"
  label:
    v === 'BACHELORS'
      ? 'Bachelors'
      : v === 'MASTERS'
        ? 'Masters'
        : v.charAt(0) + v.slice(1).toLowerCase(),
}));

export function TeamEducationForm({ teamId, initial, closeAction }: Props) {
  const router = useRouter();
  const { formAction, pending, getError, formError, state } =
    useFormAction<TeamEducationFormValues>(saveTeamEducation, {
      successMessage: 'Education saved',
      errorMessage: 'Failed to save education',
    });

  useEffect(() => {
    if (!state?.success) return;
    closeAction();
    router.refresh();
  }, [closeAction, router, state?.success]);

  const current = state?.values;
  const logoDefault = ensureUploadedAsset(state?.values?.logo ?? initial?.logo);

  const effectiveInitial: EducationInitial = {
    id: initial?.id,
    teamId,
    institution: current?.institution ?? initial?.institution ?? '',
    qualification: current?.qualification ?? initial?.qualification ?? '',
    level: (current?.level as EducationInitial['level']) ?? initial?.level ?? null,
    field: current?.field ?? initial?.field ?? '',
    startDate: (current?.startDate as string | undefined) ?? initial?.startDate ?? null,
    endDate: (current?.endDate as string | undefined) ?? initial?.endDate ?? null,
    isCurrent:
      typeof current?.isCurrent === 'boolean' ? current.isCurrent : (initial?.isCurrent ?? false),
    description: current?.description ?? initial?.description ?? '',
    logo: logoDefault,
    honor: current?.honor ?? initial?.honor ?? '',
  };

  const isEditing = Boolean(effectiveInitial.id);

  return (
    <CardWrapper2 headerLabel={isEditing ? 'Edit Education' : 'Add Education'}>
      <form action={formAction} className="needs-validation">
        <input type="hidden" name="teamId" value={teamId} />
        {effectiveInitial.id && <input type="hidden" name="id" value={effectiveInitial.id} />}

        <div className="row g-3">
          {/* Institution + Level */}
          <div className="col-md-8">
            <Input
              name="institution"
              label="Institution *"
              placeholder="e.g. University of Nairobi"
              defaultValue={effectiveInitial.institution}
              error={getError('institution')}
            />
          </div>

          <div className="col-md-4">
            <Select
              name="level"
              label="Level"
              placeholder="Education level"
              defaultValue={
                effectiveInitial.level
                  ? LEVEL_OPTIONS.find((o) => o.value === effectiveInitial.level)
                  : undefined
              }
              options={LEVEL_OPTIONS}
              error={getError('level')}
            />
          </div>

          {/* Qualification + Field */}
          <div className="col-md-6">
            <Input
              name="qualification"
              label="Qualification / Programme"
              placeholder="e.g. BSc Computer Science"
              defaultValue={effectiveInitial.qualification ?? ''}
              error={getError('qualification')}
            />
          </div>

          <div className="col-md-6">
            <Input
              name="field"
              label="Field of Study"
              placeholder="e.g. Civil Engineering, Finance, HRM"
              defaultValue={effectiveInitial.field ?? ''}
              error={getError('field')}
            />
          </div>

          {/* Dates + Current */}
          <div className="col-md-4">
            <CustomDatePicker
              name="startDate"
              label="Start Date"
              defaultValue={effectiveInitial.startDate ?? null}
            />
          </div>

          <div className="col-md-4">
            <CustomDatePicker
              name="endDate"
              label="End Date"
              defaultValue={effectiveInitial.endDate ?? null}
            />
          </div>

          <div className="col-md-4 d-flex align-items-center">
            <div className="ms-md-2">
              <Switch
                name="isCurrent"
                label="Currently enrolled / ongoing?"
                defaultChecked={effectiveInitial.isCurrent}
              />
            </div>
          </div>

          {/* Honour / Distinction inline with current */}
          <div className="col-md-6">
            <Input
              name="honor"
              label="Honour / Distinction"
              placeholder="e.g. First Class Honours, Magna Cum Laude"
              defaultValue={effectiveInitial.honor ?? ''}
              error={getError('honor')}
            />
          </div>

          {/* Logo */}
          <div className="col-md-6">
            <FileDropzone
              mode="image"
              name="logo"
              label="Institution Logo"
              folder="/leadership/education"
              defaultValue={logoDefault}
            />
          </div>

          {/* Description / Notes */}
          <div className="col-12">
            <Input
              name="description"
              as="textarea"
              label="Notes (optional)"
              placeholder="Optional notes: key projects, thesis title, leadership roles, awards..."
              defaultValue={effectiveInitial.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>

        <FormError message={formError ?? undefined} />

        {/* ACTION BUTTONS — compact inline layout */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? (
              <>
                <ClipLoader size={16} /> Saving…
              </>
            ) : (
              'Save education'
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
