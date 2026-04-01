'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { OrganisationCoreValuesHeaderValues } from '@/lib/schemas/about/organization/core-values-header';
import { CoreValuesHeaderState } from '@/lib/types/about';
import { updateOrganizationCoreValuesHeader } from '@/actions/organization';

type Props = { orgId: string; initial: CoreValuesHeaderState };

export function CoreValuesHeaderTab({ orgId, initial }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrganisationCoreValuesHeaderValues>(
      updateOrganizationCoreValuesHeader.bind(null, orgId),
      {
        successMessage: 'Saved',
        errorMessage: 'Failed to save',
      },
    );
  const formKey = useRemountOnRefresh(state?.success, initial);

  const defImage = state?.values?.coreValuesImage ?? initial.coreValuesImage;

  return (
    <form key={formKey} action={formAction}>
      <div className="mb-3">
        <Input
          name="coreValuesLeadText"
          label="Core Values Lead Text"
          as="textarea"
          defaultValue={state?.values?.coreValuesLeadText ?? initial.coreValuesLeadText ?? ''}
          error={getError('coreValuesLeadText')}
        />
      </div>
      <div className="mb-3">
        <FileDropzone
          mode="image"
          folder="organizations/core-values"
          name="coreValuesImage"
          label="Core Values Image"
          defaultValue={defImage}
          error={getError('coreValuesImage')}
        />
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
