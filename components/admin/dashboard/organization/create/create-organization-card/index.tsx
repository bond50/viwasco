'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import type { OrganizationFormValues } from '@/lib/types/about/organization-create';
import { createOrganization } from '@/actions/organization/create';
import { SubmitButton } from '@/components/form-elements/submit-button';

export function CreateOrganizationCard() {
  const { formAction, pending, state, getError, formError } = useFormAction<OrganizationFormValues>(
    createOrganization,
    {
      successMessage: 'Organization created',
      errorMessage: 'Failed to create organization',
      // After create, send them back to the settings page which will now load tabs.
      redirectTo: '/dashboard/about',
    },
  );

  const defLogo = state?.values?.logo;
  const defFeatured = state?.values?.featuredImage;

  return (
    <CardWrapper2 headerLabel="Company Settings">
      <form action={formAction}>
        <div className="row mb-3">
          <div className="col-md-3">
            <Input
              name="name"
              label="Company Name *"
              placeholder="Company name"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
              required
            />
          </div>

          <div className="col-md-3">
            <div className="mb-3">
              <Input
                name="shortName"
                label="Short Company Name"
                placeholder="Short name e.g. VIWASCO"
                defaultValue={state?.values?.shortName ?? ''}
                error={getError('shortName')}
              />
            </div>
          </div>

          <div className="col-md-3">
            <Input
              name="contactEmail"
              type="email"
              label="Contact Email *"
              placeholder="contact@example.com"
              defaultValue={state?.values?.contactEmail ?? ''}
              error={getError('contactEmail')}
              required
            />
          </div>

          <div className="col-md-3">
            <div className="mb-3">
              <Input
                name="tagline"
                label="Tagline / Slogan"
                placeholder="e.g., Water is life, we care"
                defaultValue={state?.values?.tagline ?? ''}
                error={getError('tagline')}
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <FileDropzone
              mode="image"
              folder="company/logo"
              name="logo"
              label="Logo *"
              defaultValue={defLogo}
              error={getError('logo')}
            />
          </div>
          <div className="col-md-6">
            <FileDropzone
              mode="image"
              folder="company/featured-image"
              name="featuredImage"
              label="Featured Image *"
              defaultValue={defFeatured}
              error={getError('featuredImage')}
            />
          </div>
        </div>

        <FormError message={formError ?? undefined} />

        <SubmitButton
          pending={pending}
          variant="primary"
          label="Create Company"
          labelPending="Creating…"
        />
      </form>
    </CardWrapper2>
  );
}
