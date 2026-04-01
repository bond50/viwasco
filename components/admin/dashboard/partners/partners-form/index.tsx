'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { Select } from '@/components/form-elements/select';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createPartner, updatePartner } from '@/actions/about/content/partners';
import type { PartnerFormValues, PartnershipType } from '@/lib/schemas/about/content/partners';
import { partnershipTypes } from '@/lib/schemas/about/content/partners';
import { normalizeAssetDefault } from '@/lib/assets/core';

type EditInput = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  partnershipType: PartnershipType;
  logo: unknown | null;
  isActive: boolean;
};

const TYPE_OPTIONS = partnershipTypes.map((t) => ({
  value: t,
  label: t === 'NGO' ? 'NGO' : t[0] + t.slice(1).toLowerCase(),
}));

/* CREATE */
export function PartnerCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<PartnerFormValues>(
    createPartner.bind(null),
    {
      successMessage: 'Partner created!',
      errorMessage: 'Failed to create partner',
      redirectTo: '/dashboard/about/partners',
    },
  );

  const defLogo = normalizeAssetDefault(state?.values?.logo);

  return (
    <CardWrapper2 headerLabel="New Partner">
      <form action={formAction}>
        {/* Row 1: Name / Type */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <Input
              name="name"
              label="Name *"
              placeholder="e.g., World Bank"
              defaultValue={state?.values?.name ?? ''}
              error={getError('name')}
            />
          </div>
          <div className="col-md-4">
            <Select
              name="partnershipType"
              label="Type *"
              options={TYPE_OPTIONS}
              defaultValue={
                TYPE_OPTIONS.find(
                  (o) => o.value === (state?.values?.partnershipType as PartnershipType),
                ) ?? TYPE_OPTIONS.find((o) => o.value === 'OTHER')
              }
              placeholder="Choose type"
            />
          </div>
          <div className="col-md-4">
            <Input
              name="website"
              label="Website"
              placeholder="example.org"
              defaultValue={(state?.values?.website as string | undefined) ?? ''}
              error={getError('website')}
            />
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="mb-3">
          <Input
            name="description"
            label="Description"
            as="textarea"
            rows={3}
            placeholder="Short description of the partnership."
            defaultValue={(state?.values?.description as string | undefined) ?? ''}
            error={getError('description')}
          />
        </div>

        {/* Row 4: Logo / Active */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="image"
              folder="/partners/logo"
              name="logo"
              label="Logo"
              defaultValue={defLogo}
              error={getError('logo')}
            />
          </div>
          <div className="col-md-12">
            <div className="form-check mt-4 pt-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                className="form-check-input"
                defaultChecked={Boolean(state?.values?.isActive ?? true)}
              />
              <label className="form-check-label" htmlFor="isActive">
                Active
              </label>
            </div>
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

/* EDIT (same arrangement as create) */
export function PartnerEditForm({ row }: { row: EditInput }) {
  const { formAction, pending, state, getError, formError } = useFormAction<PartnerFormValues>(
    updatePartner.bind(null, row.id),
    {
      successMessage: 'Partner updated!',
      errorMessage: 'Failed to update partner',
      redirectTo: '/dashboard/about/partners',
    },
  );

  const selectedType =
    TYPE_OPTIONS.find(
      (o) =>
        o.value === ((state?.values?.partnershipType as PartnershipType) ?? row.partnershipType),
    ) ?? TYPE_OPTIONS.find((o) => o.value === 'OTHER');

  const defLogo = normalizeAssetDefault(state?.values?.logo ?? row.logo);

  const activeDefault =
    typeof state?.values?.isActive === 'boolean' ? state.values.isActive : row.isActive;

  return (
    <CardWrapper2 headerLabel="Edit Partner">
      <form action={formAction}>
        {/* Row 1: Name / Type */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <Input
              name="name"
              label="Name *"
              defaultValue={state?.values?.name ?? row.name}
              error={getError('name')}
            />
          </div>
          <div className="col-md-4">
            <Select
              name="partnershipType"
              label="Type *"
              options={TYPE_OPTIONS}
              defaultValue={selectedType}
              placeholder="Choose type"
            />
          </div>

          <div className="col-md-4">
            <Input
              name="website"
              label="Website"
              defaultValue={(state?.values?.website as string | undefined) ?? row.website ?? ''}
              error={getError('website')}
            />
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="mb-3">
          <Input
            name="description"
            label="Description"
            as="textarea"
            rows={3}
            defaultValue={
              (state?.values?.description as string | undefined) ?? row.description ?? ''
            }
            error={getError('description')}
          />
        </div>

        {/* Row 4: Logo / Active */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="image"
              folder="/partners/logo"
              name="logo"
              label="Logo"
              defaultValue={defLogo}
              error={getError('logo')}
            />
          </div>
          <div className="col-md-12">
            <div className="form-check mt-4 pt-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                className="form-check-input"
                defaultChecked={activeDefault}
              />
              <label className="form-check-label" htmlFor="isActive">
                Active
              </label>
            </div>
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
