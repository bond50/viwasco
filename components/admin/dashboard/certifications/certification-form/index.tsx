'use client';

import { Prisma } from '@/generated/prisma/client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { CustomDatePicker } from '@/components/form-elements/date-picker';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import {
  createOrgCertification,
  updateOrgCertification,
} from '@/actions/about/content/certifications';
import type { OrgCertificationFormValues } from '@/lib/types/about/content';
import { normalizeAssetDefault } from '@/lib/assets/core';

type CertEditInput = {
  id: string;
  name: string;
  issuingAuthority: string | null;
  issueDate: Date | string | null;
  expiryDate: Date | string | null;
  certificateFile: Prisma.JsonValue | null;
  rank?: number | null;
};

export function CertificationCreateForm() {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrgCertificationFormValues>(createOrgCertification.bind(null), {
      successMessage: 'Certification created!',
      errorMessage: 'Failed to create certifications',
      redirectTo: '/dashboard/about/certifications',
    });
  const formKey = useRemountOnRefresh(state?.success, state?.success);

  return (
    <CardWrapper2 headerLabel="New Certification">
      <form key={formKey} action={formAction}>
        {/* Row 1 */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Certification Name *"
              placeholder="e.g., ISO 9001:2015"
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="issuingAuthority"
              label="Issuing Authority"
              placeholder="e.g., KEBS"
              error={getError('issuingAuthority')}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <CustomDatePicker
              name="issueDate"
              label="Issue Date"
              defaultValue={null}
              error={getError('issueDate')}
            />
          </div>
          <div className="col-md-6">
            <CustomDatePicker
              name="expiryDate"
              label="Expiry Date"
              defaultValue={null}
              error={getError('expiryDate')}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="file"
              folder="/company/certifications"
              name="certificateFile"
              label="Certificate (PDF)"
              error={getError('certificateFile')}
            />
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

export function CertificationEditForm({ cert }: { cert: CertEditInput }) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrgCertificationFormValues>(updateOrgCertification.bind(null, cert.id), {
      successMessage: 'Certification updated!',
      errorMessage: 'Failed to update certifications',
      redirectTo: '/dashboard/about/certifications',
    });
  const formKey = useRemountOnRefresh(state?.success, cert);

  const defFile = normalizeAssetDefault(state?.values?.certificateFile ?? cert.certificateFile);

  return (
    <CardWrapper2 headerLabel="Edit Certification">
      <form key={formKey} action={formAction}>
        {/* Row 1 */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Input
              name="name"
              label="Certification Name *"
              placeholder="e.g., ISO 9001:2015"
              defaultValue={state?.values?.name ?? cert.name}
              error={getError('name')}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="issuingAuthority"
              label="Issuing Authority"
              placeholder="e.g., KEBS"
              defaultValue={state?.values?.issuingAuthority ?? cert.issuingAuthority ?? ''}
              error={getError('issuingAuthority')}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <CustomDatePicker
              name="issueDate"
              label="Issue Date"
              defaultValue={
                (state?.values?.issueDate ?? cert.issueDate ?? null) as string | Date | null
              }
              error={getError('issueDate')}
            />
          </div>
          <div className="col-md-6">
            <CustomDatePicker
              name="expiryDate"
              label="Expiry Date"
              defaultValue={
                (state?.values?.expiryDate ?? cert.expiryDate ?? null) as string | Date | null
              }
              error={getError('expiryDate')}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="file"
              folder="/company/certifications"
              name="certificateFile"
              label="Certificate (PDF)"
              defaultValue={defFile}
              error={getError('certificateFile')}
            />
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
