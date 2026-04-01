'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { PublishControls } from '@/components/admin/dashboard/common/publish-controls';
import { createTender, updateTender } from '@/actions/tenders';
import type { TenderFormValues } from '@/lib/schemas/tenders';
import { normalizeAssetDefault } from '@/lib/assets/core';

type TenderStatus = 'OPEN' | 'AWARDED' | 'ARCHIVED';

type TenderEditInput = {
  id: string;
  title: string;
  slug: string;
  status: TenderStatus;
  summary: string;
  file: unknown;
  published_at: Date | null;
  closing_at: Date | null;
  is_active: boolean;
  sort_order: number;
};

const STATUS_OPTIONS: Array<{ value: TenderStatus; label: string }> = [
  { value: 'OPEN', label: 'Open' },
  { value: 'AWARDED', label: 'Awarded' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function toDateInput(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function TenderFields({
  state,
  getError,
  fileDefault,
  defaultStatus,
  defaultPublishedAt,
  defaultClosingAt,
}: {
  state: { values?: Partial<TenderFormValues> } | undefined;
  getError: (field: keyof TenderFormValues) => string | undefined;
  fileDefault: ReturnType<typeof normalizeAssetDefault>;
  defaultStatus: TenderStatus;
  defaultPublishedAt?: Date | null;
  defaultClosingAt?: Date | null;
}) {
  const statusValue = (state?.values?.status as TenderStatus | undefined) ?? defaultStatus;
  const publishedValue =
    state?.values?.published_at !== undefined ? state.values.published_at : defaultPublishedAt;
  const closingValue =
    state?.values?.closing_at !== undefined
      ? toDateInput(state.values.closing_at)
      : toDateInput(defaultClosingAt);

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <Input
            name="title"
            label="Title *"
            placeholder="e.g., Supply of HDPE Pipes"
            defaultValue={state?.values?.title ?? ''}
            error={getError('title')}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="status">
            Status *
          </label>
          <select id="status" name="status" className="form-select" defaultValue={statusValue}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {getError('status') ? (
            <div className="invalid-feedback d-block">{getError('status')}</div>
          ) : null}
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <Input
            name="summary"
            label="Summary *"
            as="textarea"
            placeholder="Short tender summary"
            defaultValue={state?.values?.summary ?? ''}
            error={getError('summary')}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="closing_at">
            Closing Date
          </label>
          <input
            id="closing_at"
            name="closing_at"
            type="date"
            className="form-control"
            defaultValue={closingValue}
          />
          <div className="mt-3">
            <FileDropzone
              mode="file"
              folder="/tenders"
              name="file"
              label="Tender File"
              defaultValue={fileDefault}
              error={getError('file')}
            />
          </div>
        </div>
      </div>

      <PublishControls
        publishedAt={{ name: 'published_at', value: publishedValue }}
        active={{ name: 'is_active', checked: Boolean(state?.values?.is_active ?? true) }}
      />
    </>
  );
}

export function TenderCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<TenderFormValues>(
    createTender.bind(null),
    {
      successMessage: 'Tender created!',
      errorMessage: 'Failed to create tender',
      redirectTo: '/dashboard/tenders',
    },
  );

  const defFile = normalizeAssetDefault(state?.values?.file);

  return (
    <CardWrapper2 headerLabel="New Tender">
      <form action={formAction}>
        <TenderFields
          state={state}
          getError={getError}
          fileDefault={defFile}
          defaultStatus="OPEN"
        />
        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function TenderEditForm({ row }: { row: TenderEditInput }) {
  const { formAction, pending, state, getError, formError } = useFormAction<TenderFormValues>(
    updateTender.bind(null, row.id),
    {
      successMessage: 'Tender updated!',
      errorMessage: 'Failed to update tender',
      redirectTo: '/dashboard/tenders',
    },
  );

  const defFile = normalizeAssetDefault(state?.values?.file ?? row.file);

  return (
    <CardWrapper2 headerLabel="Edit Tender">
      <form action={formAction}>
        <TenderFields
          state={state}
          getError={getError}
          fileDefault={defFile}
          defaultStatus={row.status}
          defaultPublishedAt={row.published_at}
          defaultClosingAt={row.closing_at}
        />
        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
