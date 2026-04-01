'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { updateOrganizationIntroduction } from '@/actions/organization';
import { IntroductionState } from '@/lib/types/about';
import { OrganisationIntroductionValues } from '@/lib/schemas/about/organization/introduction';

type Props = { orgId: string; initial: IntroductionState };

export function IntroductionTab({ orgId, initial }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrganisationIntroductionValues>(
      updateOrganizationIntroduction.bind(null, orgId),
      {
        successMessage: 'Saved',
        errorMessage: 'Failed to save',
      },
    );
  const formKey = useRemountOnRefresh(state?.success, initial);

  const defBanner = state?.values?.bannerImage ?? initial.bannerImage;
  const defIntro = state?.values?.introImage ?? initial.introImage;

  return (
    <form key={formKey} action={formAction}>
      <div className="row">
        <div className="col-md-12 mb-3">
          <Input
            name="introTitle"
            label="Introduction Title"
            placeholder="Introduction Title"
            defaultValue={state?.values?.introTitle ?? initial.introTitle ?? ''}
            error={getError('introTitle')}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="introDescription"
            label="Introductory Description"
            placeholder="Introduction Description"
            as="textarea"
            defaultValue={state?.values?.introDescription ?? initial.introDescription ?? ''}
            error={getError('introDescription')}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <FileDropzone
            mode="image"
            folder="organizations/banners"
            name="bannerImage"
            label="Banner/Breadcrumb Image"
            defaultValue={defBanner}
            error={getError('bannerImage')}
          />
        </div>
        <div className="col-md-6">
          <FileDropzone
            mode="image"
            folder="organizations/intro"
            name="introImage"
            label="Intro Image"
            defaultValue={defIntro}
            error={getError('introImage')}
          />
        </div>
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
