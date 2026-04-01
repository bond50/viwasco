'use client';

import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { useFormAction } from '@/hooks/use-form-action';
import { createProjectCategory, updateProjectCategory } from '@/actions/project-categories';
import type { ProjectCategoryFormValues } from '@/lib/schemas/projects/categories';

type ProjectCategoryEditInput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
};

export function ProjectCategoryCreateForm() {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ProjectCategoryFormValues>(createProjectCategory.bind(null), {
      successMessage: 'Category created!',
      errorMessage: 'Failed to create category',
      redirectTo: '/dashboard/projects/categories',
    });

  return (
    <CardWrapper2 headerLabel="New Project Category">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., Infrastructure Upgrade"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="description"
              label="Description"
              as="textarea"
              placeholder="Short internal note for editors about when to use this category."
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

export function ProjectCategoryEditForm({ row }: { row: ProjectCategoryEditInput }) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ProjectCategoryFormValues>(updateProjectCategory.bind(null, row.id), {
      successMessage: 'Category updated!',
      errorMessage: 'Failed to update category',
      redirectTo: '/dashboard/projects/categories',
    });

  return (
    <CardWrapper2 headerLabel="Edit Project Category">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., Service Expansion"
              defaultValue={state?.values?.name ?? row.name}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="description"
              label="Description"
              as="textarea"
              placeholder="Short internal note for editors about when to use this category."
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
