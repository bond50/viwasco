'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { Input } from '@/components/form-elements/input';
import { CustomDatePicker } from '@/components/form-elements/date-picker';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { OrganisationLegalValues } from '@/lib/schemas/about/organization/legal';
import { LegalUtilityState } from '@/lib/types/about';
import { updateOrganizationLegal } from '@/actions/organization';

type Props = { orgId: string; initial: LegalUtilityState };

export function LegalUtilityTab({ orgId, initial }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrganisationLegalValues>(updateOrganizationLegal.bind(null, orgId), {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    });
  const formKey = useRemountOnRefresh(state?.success, initial);

  const defDate =
    (state?.values?.licenseExpiry as string | Date | null | undefined) ??
    initial.licenseExpiry ??
    null;

  return (
    <form key={formKey} action={formAction}>
      <div className="row mb-3">
        <div className="col-md-4">
          <Input
            name="regulatorName"
            label="Regulator Name"
            placeholder="e.g. WASREB"
            defaultValue={state?.values?.regulatorName ?? initial.regulatorName ?? ''}
            error={getError('regulatorName')}
          />
        </div>
        <div className="col-md-4">
          <Input
            name="licenseNumber"
            label="License Number"
            placeholder="e.g. WSP/1234"
            defaultValue={state?.values?.licenseNumber ?? initial.licenseNumber ?? ''}
            error={getError('licenseNumber')}
          />
        </div>
        <div className="col-md-4">
          <CustomDatePicker
            name="licenseExpiry"
            label="License Expiry"
            // If your CustomDatePicker supports it, this will show a hint; otherwise it’s safely ignored.
            placeholder="YYYY-MM-DD (e.g. 2026-12-31)"
            defaultValue={defDate}
            error={getError('licenseExpiry')}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <Input
            name="customerCareHotline"
            label="Customer Care Hotline"
            placeholder="e.g. +254700123456 or 1545"
            defaultValue={state?.values?.customerCareHotline ?? initial.customerCareHotline ?? ''}
            error={getError('customerCareHotline')}
          />
        </div>
        <div className="col-md-6">
          <Input
            name="whatsappNumber"
            label="WhatsApp Number"
            placeholder="e.g. +254712345678 (include country code)"
            defaultValue={state?.values?.whatsappNumber ?? initial.whatsappNumber ?? ''}
            error={getError('whatsappNumber')}
          />
        </div>
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
