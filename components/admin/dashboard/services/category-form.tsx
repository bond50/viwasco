'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import {
  createServiceCategory,
  updateServiceCategory,
} from '@/actions/services/service-categories';
import type { ServiceCategoryFormValues } from '@/lib/schemas/services/service-categories';

type CategoryEditInput = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
};

export function ServiceCategoryCreateForm() {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ServiceCategoryFormValues>(createServiceCategory.bind(null), {
      successMessage: 'Service category created!',
      errorMessage: 'Failed to create service category',
      redirectTo: '/dashboard/services/service-categories',
    });

  return (
    <CardWrapper2 headerLabel="New Service Category">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., Water Supply"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="icon"
              label="Icon"
              placeholder="e.g., MdWaterDrop"
              defaultValue={state?.values?.icon ?? ''}
              error={getError('icon')}
            />
          </div>
        </div>

        <div className="mb-3">
          <Input
            name="description"
            label="Description"
            as="textarea"
            rows={3}
            placeholder="Short description for this category."
            defaultValue={state?.values?.description ?? ''}
            error={getError('description')}
          />
        </div>

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function ServiceCategoryEditForm({ row }: { row: CategoryEditInput }) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ServiceCategoryFormValues>(updateServiceCategory.bind(null, row.id), {
      successMessage: 'Service category updated!',
      errorMessage: 'Failed to update service category',
      redirectTo: '/dashboard/services/service-categories',
    });

  return (
    <CardWrapper2 headerLabel="Edit Service Category">
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
              name="icon"
              label="Icon"
              defaultValue={state?.values?.icon ?? row.icon ?? ''}
              error={getError('icon')}
            />
          </div>
        </div>

        <div className="mb-3">
          <Input
            name="description"
            label="Description"
            as="textarea"
            rows={3}
            defaultValue={state?.values?.description ?? row.description ?? ''}
            error={getError('description')}
          />
        </div>

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
