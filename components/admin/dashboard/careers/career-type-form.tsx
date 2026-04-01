'use client';

import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { useFormAction } from '@/hooks/use-form-action';
import { createCareerType, updateCareerType } from '@/actions/careers/types';
import type { CareerTypeFormValues } from '@/lib/schemas/careers/types';

type CareerTypeEditInput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
};

export function CareerTypeCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<CareerTypeFormValues>(
    createCareerType.bind(null),
    {
      successMessage: 'Type created!',
      errorMessage: 'Failed to create type',
      redirectTo: '/dashboard/careers/types',
    },
  );
  return (
    <CardWrapper2 headerLabel="New Career Type">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="description"
              label="Description"
              as="textarea"
              defaultValue={state?.values?.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>
        <div className="form-check mb-3">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            className="form-check-input"
            defaultChecked={Boolean(state?.values?.is_active ?? true)}
          />
          <label className="form-check-label" htmlFor="is_active">
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

export function CareerTypeEditForm({ row }: { row: CareerTypeEditInput }) {
  const { formAction, pending, state, getError, formError } = useFormAction<CareerTypeFormValues>(
    updateCareerType.bind(null, row.id),
    {
      successMessage: 'Type updated!',
      errorMessage: 'Failed to update type',
      redirectTo: '/dashboard/careers/types',
    },
  );
  return (
    <CardWrapper2 headerLabel="Edit Career Type">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              defaultValue={state?.values?.name ?? row.name}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="description"
              label="Description"
              as="textarea"
              defaultValue={state?.values?.description ?? row.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>
        <div className="form-check mb-3">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            className="form-check-input"
            defaultChecked={Boolean(state?.values?.is_active ?? row.is_active)}
          />
          <label className="form-check-label" htmlFor="is_active">
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
