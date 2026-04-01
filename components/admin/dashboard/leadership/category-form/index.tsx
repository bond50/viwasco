'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { FormError } from '@/components/form-error';
import { createCategory, updateCategory } from '@/actions/about/content/leadership/team-categories';
import type { ManagementCategoryFormValues } from '@/lib/types/about/content';
import { Select } from '@/components/form-elements/select';
import { LeadershipCategoryType } from '@/generated/prisma/client';

// --- Type-safe options + helpers ---
const CATEGORY_TYPE_OPTIONS = [
  { value: 'BOARD', label: 'Board' },
  { value: 'EXECUTIVE', label: 'Executive' },
  { value: 'MANAGEMENT', label: 'Management' },
] as const;

type CategoryType = LeadershipCategoryType;
const DEFAULT_TYPE: CategoryType = 'MANAGEMENT';

const optionForType = (v?: string | null) =>
  CATEGORY_TYPE_OPTIONS.find((o) => o.value === (v as CategoryType)) ??
  CATEGORY_TYPE_OPTIONS.find((o) => o.value === DEFAULT_TYPE)!;

// --- Create ---
export function CategoryCreateForm() {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ManagementCategoryFormValues>(createCategory.bind(null), {
      successMessage: 'Category created!',
      errorMessage: 'Failed to create category',
      redirectTo: '/dashboard/about/leadership/categories',
    });
  const formKey = useRemountOnRefresh(state?.success, state?.success);

  const defaultTypeOpt = optionForType(state?.values?.categoryType as string | undefined);

  return (
    <CardWrapper2 headerLabel="New Leadership Category">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., Board of Directors"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Select
              name="categoryType"
              label="Type"
              placeholder="Choose category type"
              options={CATEGORY_TYPE_OPTIONS}
              defaultValue={defaultTypeOpt}
              error={getError('categoryType')}
            />
          </div>
        </div>

        <div className="mb-3">
          <Input
            name="description"
            label="Description"
            as="textarea"
            rows={3}
            placeholder="Short summary of this leadership group’s role."
            defaultValue={(state?.values?.description as string) ?? ''}
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

// --- Edit ---
type EditInput = {
  id: string;
  name: string;
  description: string | null;
  rank: number;
  categoryType: CategoryType;
};

export function CategoryEditForm({ row }: { row: EditInput }) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ManagementCategoryFormValues>(updateCategory.bind(null, row.id), {
      successMessage: 'Category updated!',
      errorMessage: 'Failed to update category',
      redirectTo: '/dashboard/about/leadership/categories',
    });
  const formKey = useRemountOnRefresh(state?.success, row);

  const defaultTypeOpt = optionForType(
    (state?.values?.categoryType as string | undefined) ?? row.categoryType,
  );

  return (
    <CardWrapper2 headerLabel="Edit Leadership Category">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., Executive Committee"
              defaultValue={state?.values?.name ?? row.name}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Select
              name="categoryType"
              label="Type"
              placeholder="Choose category type"
              options={CATEGORY_TYPE_OPTIONS}
              defaultValue={defaultTypeOpt}
              error={getError('categoryType')}
            />
          </div>
        </div>

        <div className="mb-3">
          <Input
            name="description"
            label="Description"
            as="textarea"
            rows={3}
            placeholder="Short summary of this leadership group’s role."
            defaultValue={
              (state?.values?.description as string | undefined) ?? row.description ?? ''
            }
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
