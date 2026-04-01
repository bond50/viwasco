'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createResourceKind, updateResourceKind } from '@/actions/resources/kinds';
import type { ResourceKindFormValues } from '@/lib/schemas/resources/kinds';

export function ResourceKindCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<ResourceKindFormValues>(
    createResourceKind.bind(null),
    {
      successMessage: 'Resource kind created!',
      errorMessage: 'Failed to create resource kind',
      redirectTo: '/dashboard/resources/kinds',
    },
  );

  const activeChecked =
    typeof state?.values?.is_active === 'boolean' ? state.values.is_active : true;

  return (
    <CardWrapper2 headerLabel="New Resource Kind">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., Reports"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="description"
              label="Description"
              placeholder="Short description for this resource section"
              defaultValue={state?.values?.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>

        <div className="mb-3 form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="kind-active"
            name="is_active"
            defaultChecked={activeChecked}
          />
          <label className="form-check-label" htmlFor="kind-active">
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

export function ResourceKindEditForm({
  row,
}: {
  row: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
  };
}) {
  const { formAction, pending, state, getError, formError } = useFormAction<ResourceKindFormValues>(
    updateResourceKind.bind(null, row.id),
    {
      successMessage: 'Resource kind updated!',
      errorMessage: 'Failed to update resource kind',
      redirectTo: '/dashboard/resources/kinds',
    },
  );

  const activeChecked =
    typeof state?.values?.is_active === 'boolean' ? state.values.is_active : row.is_active;

  return (
    <CardWrapper2 headerLabel="Edit Resource Kind">
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
              defaultValue={state?.values?.description ?? row.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>

        <div className="mb-3 form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="kind-active"
            name="is_active"
            defaultChecked={activeChecked}
          />
          <label className="form-check-label" htmlFor="kind-active">
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
