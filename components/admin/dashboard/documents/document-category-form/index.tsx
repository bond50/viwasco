'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import { createDocCategory, updateDocCategory } from '@/actions/about/content/document-categories';
import { OrgDocumentCategoryFormValues } from '@/lib/schemas/about/content/document-categories';

type CategoryEditInput = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rank: number;
  isActive: boolean;
};

export function DocumentCategoryCreateForm() {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrgDocumentCategoryFormValues>(createDocCategory.bind(null), {
      successMessage: 'Category created!',
      errorMessage: 'Failed to create category',
      redirectTo: '/dashboard/about/document-categories',
    });

  const activeChecked = typeof state?.values?.isActive === 'boolean' ? state.values.isActive : true;

  return (
    <CardWrapper2 headerLabel="New Document Category">
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
          {/* Slug is generated automatically from Name (not shown in form) */}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <Input
              name="description"
              label="Description"
              as="textarea"
              placeholder="Short description shown on Resources / Downloads page (optional)"
              defaultValue={state?.values?.description ?? ''}
              error={getError('description')}
            />
          </div>
          <div className="col-md-4 d-flex flex-column gap-3">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="doc-cat-active"
                name="isActive"
                defaultChecked={activeChecked}
              />
              <label className="form-check-label" htmlFor="doc-cat-active">
                Active (show in filters)
              </label>
            </div>
            {/* Rank is auto via getNextRank + RankedList reorder */}
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

export function DocumentCategoryEditForm({ category }: { category: CategoryEditInput }) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrgDocumentCategoryFormValues>(updateDocCategory.bind(null, category.id), {
      successMessage: 'Category updated!',
      errorMessage: 'Failed to update category',
      redirectTo: '/dashboard/about/document-categories',
    });

  const activeChecked =
    typeof state?.values?.isActive === 'boolean' ? state.values.isActive : category.isActive;

  return (
    <CardWrapper2 headerLabel="Edit Document Category">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., Reports"
              defaultValue={state?.values?.name ?? category.name}
              error={getError('name')}
            />
          </div>
          {/* Slug is not editable; stays stable for URLs */}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <Input
              name="description"
              label="Description"
              as="textarea"
              placeholder="Short description shown on Resources / Downloads page (optional)"
              defaultValue={state?.values?.description ?? category.description ?? ''}
              error={getError('description')}
            />
          </div>
          <div className="col-md-4 d-flex flex-column gap-3">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="doc-cat-active"
                name="isActive"
                defaultChecked={activeChecked}
              />
              <label className="form-check-label" htmlFor="doc-cat-active">
                Active (show in filters)
              </label>
            </div>
            {/* Rank is controlled by RankedList reorder, not this form */}
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
