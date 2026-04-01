'use client';

import { Prisma } from '@/generated/prisma/client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { CustomDatePicker } from '@/components/form-elements/date-picker';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createOrgAward, updateOrgAward } from '@/actions/about/content/awards';
import type { OrgAwardFormValues } from '@/lib/types/about/content';
import { normalizeAssetDefault } from '@/lib/assets/core';

type AwardEditInput = {
  id: string;
  title: string;
  issuer: string | null;
  date: Date | string | null;
  summary: string | null;
  badge: Prisma.JsonValue | null;
};

export function AwardCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgAwardFormValues>(
    createOrgAward.bind(null),
    {
      successMessage: 'Award created!',
      errorMessage: 'Failed to create award',
      redirectTo: '/dashboard/about/awards',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, state?.success);

  const defBadge = normalizeAssetDefault(state?.values?.badge);

  return (
    <CardWrapper2 headerLabel="New Award">
      <form key={formKey} action={formAction}>
        {/* Row 1: Title / Issue Date / Issuer */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., WASREB Performance Award 2025"
              defaultValue={state?.values?.title ?? ''}
              error={getError('title')}
            />
          </div>

          <div className="col-md-4">
            <CustomDatePicker
              name="date"
              label="Issue Date"
              defaultValue={(state?.values?.date ?? null) as string | Date | null}
              error={getError('date')}
            />
          </div>

          <div className="col-md-4">
            <Input
              name="issuer"
              label="Issuer"
              placeholder="e.g., WASREB"
              defaultValue={state?.values?.issuer ?? ''}
              error={getError('issuer')}
            />
          </div>
        </div>

        {/* Row 2: Summary */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="summary"
              label="Summary"
              as="textarea"
              placeholder="Short note about the award (optional)"
              defaultValue={state?.values?.summary ?? ''}
              error={getError('summary')}
            />
          </div>
        </div>

        {/* Row 3: Badge */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="either"
              folder="/company/awards"
              name="badge"
              label="Badge / Certificate (Image or PDF)"
              defaultValue={defBadge}
              error={getError('badge')}
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

export function AwardEditForm({ award }: { award: AwardEditInput }) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgAwardFormValues>(
    updateOrgAward.bind(null, award.id),
    {
      successMessage: 'Award updated!',
      errorMessage: 'Failed to update award',
      redirectTo: '/dashboard/about/awards',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, award);

  const defBadge = normalizeAssetDefault(state?.values?.badge ?? award.badge);

  return (
    <CardWrapper2 headerLabel="Edit Award">
      <form key={formKey} action={formAction}>
        {/* Row 1: Title / Issue Date / Issuer */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., WASREB Performance Award 2025"
              defaultValue={state?.values?.title ?? award.title}
              error={getError('title')}
            />
          </div>

          <div className="col-md-4">
            <CustomDatePicker
              name="date"
              label="Issue Date"
              defaultValue={(state?.values?.date ?? award.date ?? null) as string | Date | null}
              error={getError('date')}
            />
          </div>

          <div className="col-md-4">
            <Input
              name="issuer"
              label="Issuer"
              placeholder="e.g., WASREB"
              defaultValue={state?.values?.issuer ?? award.issuer ?? ''}
              error={getError('issuer')}
            />
          </div>
        </div>

        {/* Row 2: Summary */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="summary"
              label="Summary"
              as="textarea"
              placeholder="Short note about the award (optional)"
              defaultValue={state?.values?.summary ?? award.summary ?? ''}
              error={getError('summary')}
            />
          </div>
        </div>

        {/* Row 3: Badge */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="either"
              folder="/company/awards"
              name="badge"
              label="Badge / Certificate (Image or PDF)"
              defaultValue={defBadge}
              error={getError('badge')}
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
