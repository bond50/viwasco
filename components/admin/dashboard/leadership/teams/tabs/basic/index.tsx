// components/admin/dashboard/leadership/teams/tabs/basic.tsx
'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { type GenericOption, Select } from '@/components/form-elements/select';

import type { TeamSettingsData } from '@/lib/types/about/leadership';
import type { ManagementTeamBasicValues } from '@/lib/schemas/about/content/leadership';
import { updateTeamMemberBasic } from '@/actions/about/content/leadership';
import { ensureUploadedAsset } from '@/lib/assets/core';
import { resolveDefaultOption } from '@/lib/select';

type CategoryOption = GenericOption<string>;

type Props = {
  team: TeamSettingsData;
  // just the bits we need; TeamSettingsShell will pass these in
  categories: { id: string; name: string }[];
};

export function TeamBasicTab({ team, categories }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ManagementTeamBasicValues>(updateTeamMemberBasic.bind(null, team.id), {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    });
  const formKey = useRemountOnRefresh(state?.success, team);

  const defImage = ensureUploadedAsset(state?.values?.image ?? team.basic.image);

  // 🔹 Build options from ALL categories
  const categoryOptions: CategoryOption[] = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // 🔹 Prefer submitted value; fall back to current team category
  const selectedCategoryId = (state?.values?.categoryId as string | undefined) ?? team.category.id;

  const defaultCategoryOption = resolveDefaultOption(categoryOptions, selectedCategoryId);

  return (
    <form key={formKey} action={formAction}>
      <div className="row mb-3">
        <div className="col-md-4">
          <Select
            name="categoryId"
            label="Category *"
            placeholder="Select category"
            options={categoryOptions}
            defaultValue={defaultCategoryOption}
            error={getError('categoryId')}
            isMulti={false}
          />
        </div>

        <div className="col-md-4">
          <Input
            name="name"
            label="Name *"
            defaultValue={state?.values?.name ?? team.basic.name}
            error={getError('name')}
          />
        </div>

        <div className="col-md-4">
          <Input
            name="position"
            label="Position *"
            placeholder="e.g. Managing Director"
            defaultValue={state?.values?.position ?? team.basic.position}
            error={getError('position')}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <FileDropzone
            mode="image"
            folder="leadership/team"
            name="image"
            label="Profile Image *"
            defaultValue={defImage}
            error={getError('image')}
          />
        </div>
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
