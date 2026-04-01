'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SubmitButton } from '@/components/form-elements/submit-button';
import { createTeamMember } from '@/actions/about/content/leadership';
import type { ManagementTeamCreateValues } from '@/lib/schemas/about/content/leadership';
import { type GenericOption, Select } from '@/components/form-elements/select';
import { resolveDefaultOption } from '@/lib/select';

type CategoryOption = {
  id: string;
  name: string;
};

type Props = {
  /** Optional pre-selected category id (e.g. from URL) */
  initialCategoryId?: string;
  /** Category options for dropdown (required for this version) */
  categories: CategoryOption[];
};

export function CreateTeamMemberCard({ initialCategoryId, categories }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ManagementTeamCreateValues>(createTeamMember, {
      successMessage: 'Team member created',
      errorMessage: 'Failed to create team member',
      redirectTo: '/dashboard/about/leadership/teams',
    });
  const formKey = useRemountOnRefresh(state?.success, state?.success);

  const defImage = state?.values?.image;

  const categoryOptions: GenericOption<string>[] = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const selectedIdFromState =
    (state?.values?.categoryId as string | undefined) ?? initialCategoryId;

  const defaultOption =
    resolveDefaultOption(categoryOptions, selectedIdFromState) ?? categoryOptions[0];

  return (
    <CardWrapper2 headerLabel="Create Leadership Team Member">
      <form key={formKey} action={formAction}>
        <div className="row mb-3">
          <div className="col-md-4">
            <Input
              name="name"
              label="Full Name *"
              placeholder="e.g. Jane Wanjiru"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
              required
            />
          </div>

          <div className="col-md-4">
            <Input
              name="position"
              label="Position *"
              placeholder="e.g. Managing Director"
              defaultValue={state?.values?.position ?? ''}
              error={getError('position')}
              required
            />
          </div>

          <div className="col-md-4">
            <Select<false, string>
              name="categoryId"
              label="Category *"
              placeholder="Select category"
              defaultValue={defaultOption}
              error={getError('categoryId')}
              isMulti={false}
              options={categoryOptions}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12">
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

        <SubmitButton
          pending={pending}
          variant="primary"
          label="Create Team Member"
          labelPending="Creating…"
        />
      </form>
    </CardWrapper2>
  );
}
