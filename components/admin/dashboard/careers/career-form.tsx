'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { PublishControls } from '@/components/admin/dashboard/common/publish-controls';
import { createCareer, updateCareer } from '@/actions/careers';
import type { CareerFormValues } from '@/lib/schemas/careers';
import { normalizeAssetDefault } from '@/lib/assets/core';
import type { CareerType } from '@/lib/data/admin/careers/types';

type CareerEditInput = {
  id: string;
  typeId: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  summary: string | null;
  file: unknown;
  closing_at: Date | null;
  is_active: boolean;
  sort_order: number;
};

function toDateInput(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function CareerFields({
  state,
  getError,
  types,
  fileDefault,
  defaultTypeId,
  defaultClosingAt,
}: {
  state: { values?: Partial<CareerFormValues> } | undefined;
  getError: (field: keyof CareerFormValues) => string | undefined;
  types: CareerType[];
  fileDefault: ReturnType<typeof normalizeAssetDefault>;
  defaultTypeId?: string;
  defaultClosingAt?: Date | null;
}) {
  const closingValue =
    state?.values?.closing_at !== undefined
      ? toDateInput(state.values.closing_at)
      : toDateInput(defaultClosingAt);
  const typeValue = (state?.values?.typeId as string | undefined) ?? defaultTypeId ?? '';

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <Input
            name="title"
            label="Title *"
            placeholder="e.g., Water Quality Officer"
            defaultValue={state?.values?.title ?? ''}
            error={getError('title')}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="typeId">
            Type *
          </label>
          <select id="typeId" name="typeId" className="form-select" defaultValue={typeValue}>
            <option value="">Select type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          {getError('typeId') ? (
            <div className="invalid-feedback d-block">{getError('typeId')}</div>
          ) : null}
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <Input
            name="department"
            label="Department *"
            defaultValue={state?.values?.department ?? ''}
            error={getError('department')}
          />
        </div>
        <div className="col-md-6">
          <Input
            name="location"
            label="Location *"
            defaultValue={state?.values?.location ?? ''}
            error={getError('location')}
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <Input
            name="summary"
            label="Summary"
            as="textarea"
            placeholder="Short note (optional)"
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
              folder="/careers"
              name="file"
              label="Application File"
              defaultValue={fileDefault}
              error={getError('file')}
            />
          </div>
        </div>
      </div>

      <PublishControls
        active={{
          name: 'is_active',
          checked: Boolean(state?.values?.is_active ?? true),
        }}
      />
    </>
  );
}

export function CareerCreateForm({ types }: { types: CareerType[] }) {
  const { formAction, pending, state, getError, formError } = useFormAction<CareerFormValues>(
    createCareer.bind(null),
    {
      successMessage: 'Career created!',
      errorMessage: 'Failed to create career',
      redirectTo: '/dashboard/careers',
    },
  );
  const defFile = normalizeAssetDefault(state?.values?.file);

  return (
    <CardWrapper2 headerLabel="New Career">
      <form action={formAction}>
        <CareerFields state={state} getError={getError} types={types} fileDefault={defFile} />
        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function CareerEditForm({ row, types }: { row: CareerEditInput; types: CareerType[] }) {
  const { formAction, pending, state, getError, formError } = useFormAction<CareerFormValues>(
    updateCareer.bind(null, row.id),
    {
      successMessage: 'Career updated!',
      errorMessage: 'Failed to update career',
      redirectTo: '/dashboard/careers',
    },
  );
  const defFile = normalizeAssetDefault(state?.values?.file ?? row.file);

  return (
    <CardWrapper2 headerLabel="Edit Career">
      <form action={formAction}>
        <CareerFields
          state={state}
          getError={getError}
          types={types}
          fileDefault={defFile}
          defaultTypeId={row.typeId}
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
