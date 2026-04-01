'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { BasicMediaState } from '@/lib/types/about';
import { OrganisationBasicValues } from '@/lib/schemas/about/organization/basic';
import { updateOrganizationBasic } from '@/actions/organization';

type Props = { orgId: string; initial: BasicMediaState };

export function BasicMediaTab({ orgId, initial }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrganisationBasicValues>(updateOrganizationBasic.bind(null, orgId), {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    });
  const formKey = useRemountOnRefresh(state?.success, initial);

  const defLogo = state?.values?.logo ?? initial.logo;
  const defFeatured = state?.values?.featuredImage ?? initial.featuredImage;

  return (
    <form key={formKey} action={formAction}>
      <div className="row mb-3">
        <div className="col-md-12">
          <Input
            name="name"
            label="Name *"
            defaultValue={state?.values?.name ?? initial.name}
            error={getError('name')}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <Input
            name="shortName"
            label="Short Name"
            placeholder="eg VIWASCO"
            defaultValue={state?.values?.shortName ?? initial.shortName ?? ''}
            error={getError('shortName')}
          />
        </div>
        <div className="col-md-6">
          <Input
            name="tagline"
            label="Tagline"
            placeholder="e.g Water is life"
            defaultValue={state?.values?.tagline ?? initial.tagline ?? ''}
            error={getError('tagline')}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <FileDropzone
            mode="image"
            folder="organizations/logo"
            name="logo"
            label="Logo *"
            defaultValue={defLogo}
            error={getError('logo')}
          />
        </div>
        <div className="col-md-6">
          <FileDropzone
            mode="image"
            folder="organizations/featured-image"
            name="featuredImage"
            label="Featured Image *"
            defaultValue={defFeatured}
            error={getError('featuredImage')}
          />
        </div>
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
