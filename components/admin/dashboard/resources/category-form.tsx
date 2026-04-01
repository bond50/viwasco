'use client';

import { useMemo } from 'react';
import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createResourceCategory, updateResourceCategory } from '@/actions/resources/categories';
import type { ResourceCategoryFormValues } from '@/lib/schemas/resources/categories';

type KindOption = {
  id: string;
  name: string;
};

function KindSelect({
  kinds,
  value,
  onChange,
}: {
  kinds: KindOption[];
  value: string;
  onChange?: (value: string) => void;
}) {
  return (
    <select
      name="kindId"
      className="form-select"
      defaultValue={value}
      onChange={(event) => onChange?.(event.target.value)}
    >
      <option value="">Select kind</option>
      {kinds.map((kind) => (
        <option key={kind.id} value={kind.id}>
          {kind.name}
        </option>
      ))}
    </select>
  );
}

export function ResourceCategoryCreateForm({ kinds }: { kinds: KindOption[] }) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ResourceCategoryFormValues>(createResourceCategory.bind(null), {
      successMessage: 'Resource category created!',
      errorMessage: 'Failed to create resource category',
      redirectTo: '/dashboard/resources/categories',
    });

  const selectedKindId = (state?.values?.kindId as string | undefined) ?? kinds[0]?.id ?? '';
  const activeChecked =
    typeof state?.values?.is_active === 'boolean' ? state.values.is_active : true;

  return (
    <CardWrapper2 headerLabel="New Resource Category">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label" htmlFor="kindId">
              Kind *
            </label>
            <KindSelect kinds={kinds} value={selectedKindId} />
            {getError('kindId') ? (
              <div className="invalid-feedback d-block">{getError('kindId')}</div>
            ) : null}
          </div>
          <div className="col-md-4">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., Annual Reports"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="description"
              label="Description"
              defaultValue={state?.values?.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>

        <div className="mb-3 form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="category-active"
            name="is_active"
            defaultChecked={activeChecked}
          />
          <label className="form-check-label" htmlFor="category-active">
            Active
          </label>
        </div>

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function ResourceCategoryEditForm({
  row,
  kinds,
}: {
  row: {
    id: string;
    kindId: string;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
  };
  kinds: KindOption[];
}) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ResourceCategoryFormValues>(updateResourceCategory.bind(null, row.id), {
      successMessage: 'Resource category updated!',
      errorMessage: 'Failed to update resource category',
      redirectTo: '/dashboard/resources/categories',
    });

  const kindLabel = useMemo(
    () => kinds.find((kind) => kind.id === row.kindId)?.name ?? 'Unknown kind',
    [kinds, row.kindId],
  );
  const activeChecked =
    typeof state?.values?.is_active === 'boolean' ? state.values.is_active : row.is_active;

  return (
    <CardWrapper2 headerLabel="Edit Resource Category">
      <form action={formAction}>
        <input type="hidden" name="kindId" value={row.kindId} />

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label">Kind</label>
            <input className="form-control" value={kindLabel} readOnly />
          </div>
          <div className="col-md-4">
            <Input
              name="name"
              label="Name *"
              defaultValue={state?.values?.name ?? row.name}
              error={getError('name')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="description"
              label="Description"
              defaultValue={state?.values?.description ?? row.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>

        <div className="mb-3 form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="category-active"
            name="is_active"
            defaultChecked={activeChecked}
          />
          <label className="form-check-label" htmlFor="category-active">
            Active
          </label>
        </div>

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
