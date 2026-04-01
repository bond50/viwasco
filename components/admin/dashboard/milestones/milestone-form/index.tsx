'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { CustomDatePicker } from '@/components/form-elements/date-picker';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createOrgMilestone, updateOrgMilestone } from '@/actions/about/content/milestones';
import type { OrgMilestoneFormValues } from '@/lib/types/about/content';
import { normalizeAssetDefault } from '@/lib/assets/core';

type MilestoneEditInput = {
  id: string;
  title: string;
  summary: string | null;
  year: number | null;
  date: Date | string | null;
  image: unknown;
  rank: number;
};

export function MilestoneCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgMilestoneFormValues>(
    createOrgMilestone.bind(null),
    {
      successMessage: 'Milestone created!',
      errorMessage: 'Failed to create milestone',
      redirectTo: '/dashboard/about/milestones',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, state?.success);

  const defImage = normalizeAssetDefault(state?.values?.image);

  return (
    <CardWrapper2 headerLabel="New Milestone">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., New Treatment Plant Commissioned"
              defaultValue={state?.values?.title ?? ''}
              error={getError('title')}
            />
          </div>
          <div className="col-md-3">
            <Input
              name="year"
              type="number"
              label="Year"
              placeholder="e.g., 2025"
              defaultValue={
                typeof state?.values?.year === 'number' ? String(state.values.year) : ''
              }
              error={getError('year')}
            />
          </div>
          <div className="col-md-3">
            <CustomDatePicker
              name="date"
              label="Exact Date (optional)"
              defaultValue={(state?.values?.date ?? null) as string | Date | null}
              error={getError('date')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="summary"
              as="textarea"
              label="Summary"
              placeholder="Short description of this milestone..."
              defaultValue={state?.values?.summary ?? ''}
              error={getError('summary')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="image"
              folder="/company/milestones"
              name="image"
              label="Image"
              defaultValue={defImage}
              error={getError('image')}
            />
          </div>
        </div>

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function MilestoneEditForm({ milestone }: { milestone: MilestoneEditInput }) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgMilestoneFormValues>(
    updateOrgMilestone.bind(null, milestone.id),
    {
      successMessage: 'Milestone updated!',
      errorMessage: 'Failed to update milestone',
      redirectTo: '/dashboard/about/milestones',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, milestone);

  const defImage = normalizeAssetDefault(state?.values?.image ?? milestone.image);

  return (
    <CardWrapper2 headerLabel="Edit Milestone">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., New Treatment Plant Commissioned"
              defaultValue={state?.values?.title ?? milestone.title}
              error={getError('title')}
            />
          </div>
          <div className="col-md-3">
            <Input
              name="year"
              type="number"
              label="Year"
              placeholder="e.g., 2025"
              defaultValue={
                typeof state?.values?.year === 'number'
                  ? String(state.values.year)
                  : milestone.year !== null
                    ? String(milestone.year)
                    : ''
              }
              error={getError('year')}
            />
          </div>
          <div className="col-md-3">
            <CustomDatePicker
              name="date"
              label="Exact Date (optional)"
              defaultValue={(state?.values?.date ?? milestone.date ?? null) as string | Date | null}
              error={getError('date')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="summary"
              as="textarea"
              label="Summary"
              placeholder="Short description of this milestone..."
              defaultValue={state?.values?.summary ?? milestone.summary ?? ''}
              error={getError('summary')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="file"
              folder="/company/milestones"
              name="image"
              label="Image"
              defaultValue={defImage}
              error={getError('image')}
            />
          </div>
        </div>

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
