'use client';

import { useMemo, useState } from 'react';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { PublishControls } from '@/components/admin/dashboard/common/publish-controls';
import { createResource, updateResource } from '@/actions/resources';
import type { ResourceFormValues } from '@/lib/schemas/resources';
import { normalizeAssetDefault } from '@/lib/assets/core';

type ResourceKindOption = {
  id: string;
  name: string;
  slug: string;
};

type ResourceCategoryOption = {
  id: string;
  kindId: string;
  name: string;
  slug: string;
};

type ResourceEditInput = {
  id: string;
  title: string;
  slug: string;
  kindId: string;
  categoryId: string | null;
  summary: string;
  file: unknown;
  is_active: boolean;
  sort_order: number;
};

type BaseProps = {
  kinds: ResourceKindOption[];
  categories: ResourceCategoryOption[];
};

function ResourceFields({
  state,
  getError,
  kinds,
  categories,
  defaultKindId,
  defaultCategoryId,
  defaultActive,
  defaultFile,
}: {
  state: { values?: Partial<ResourceFormValues> } | undefined;
  getError: (field: keyof ResourceFormValues) => string | undefined;
  kinds: ResourceKindOption[];
  categories: ResourceCategoryOption[];
  defaultKindId: string;
  defaultCategoryId: string;
  defaultActive: boolean;
  defaultFile?: unknown;
}) {
  const initialKindId = (state?.values?.kindId as string | undefined) ?? defaultKindId;
  const [selectedKindId, setSelectedKindId] = useState(initialKindId);
  const selectedCategoryId = (state?.values?.categoryId as string | undefined) ?? defaultCategoryId;
  const isActive =
    typeof state?.values?.is_active === 'boolean' ? state.values.is_active : defaultActive;
  const fileDefault = normalizeAssetDefault(state?.values?.file ?? defaultFile);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.kindId === selectedKindId),
    [categories, selectedKindId],
  );

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <Input
            name="title"
            label="Title *"
            placeholder="e.g., Annual Report 2025"
            defaultValue={state?.values?.title ?? ''}
            error={getError('title')}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="kindId">
            Kind *
          </label>
          <select
            id="kindId"
            name="kindId"
            className="form-select"
            defaultValue={initialKindId}
            onChange={(event) => setSelectedKindId(event.target.value)}
          >
            <option value="">Select kind</option>
            {kinds.map((kind) => (
              <option key={kind.id} value={kind.id}>
                {kind.name}
              </option>
            ))}
          </select>
          {getError('kindId') ? (
            <div className="invalid-feedback d-block">{getError('kindId')}</div>
          ) : null}
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="categoryId">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="form-select"
            defaultValue={selectedCategoryId}
          >
            <option value="">Uncategorized</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <Input
            name="summary"
            label="Short Description *"
            as="textarea"
            placeholder="Short summary shown on the public resources page"
            defaultValue={state?.values?.summary ?? ''}
            error={getError('summary')}
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <FileDropzone
            mode="file"
            folder="/company/resources"
            name="file"
            label="Resource file (PDF)"
            defaultValue={fileDefault}
            error={getError('file')}
          />
        </div>
      </div>

      <PublishControls
        active={{
          name: 'is_active',
          label: 'Visible on website',
          checked: isActive,
        }}
      />
    </>
  );
}

export function ResourceCreateForm({ kinds, categories }: BaseProps) {
  const { formAction, pending, state, getError, formError } = useFormAction<ResourceFormValues>(
    createResource.bind(null),
    {
      successMessage: 'Resource created!',
      errorMessage: 'Failed to create resource',
      redirectTo: '/dashboard/resources',
    },
  );

  return (
    <CardWrapper2 headerLabel="New Resource">
      <form action={formAction}>
        <ResourceFields
          state={state}
          getError={getError}
          kinds={kinds}
          categories={categories}
          defaultKindId={kinds[0]?.id ?? ''}
          defaultCategoryId=""
          defaultActive={true}
        />

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function ResourceEditForm({
  row,
  kinds,
  categories,
}: { row: ResourceEditInput } & BaseProps) {
  const { formAction, pending, state, getError, formError } = useFormAction<ResourceFormValues>(
    updateResource.bind(null, row.id),
    {
      successMessage: 'Resource updated!',
      errorMessage: 'Failed to update resource',
      redirectTo: '/dashboard/resources',
    },
  );

  const defaultKindId = (state?.values?.kindId as string | undefined) ?? row.kindId;
  const defaultCategoryId =
    (state?.values?.categoryId as string | undefined) ?? row.categoryId ?? '';
  const defaultActive =
    typeof state?.values?.is_active === 'boolean' ? state.values.is_active : row.is_active;

  return (
    <CardWrapper2 headerLabel="Edit Resource">
      <form action={formAction}>
        <ResourceFields
          state={state}
          getError={getError}
          kinds={kinds}
          categories={categories}
          defaultKindId={defaultKindId}
          defaultCategoryId={defaultCategoryId}
          defaultActive={defaultActive}
          defaultFile={row.file}
        />

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
