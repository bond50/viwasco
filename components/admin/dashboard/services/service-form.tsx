'use client';

import type { Prisma } from '@/generated/prisma/client';

import { useFormAction } from '@/hooks/use-form-action';
import { useExcerpt } from '@/hooks/use-excerpt';
import { CardWrapper2 } from '@/components/card/card-2';
import { IconPicker } from '@/components/common/icons/IconPicker';
import { Input } from '@/components/form-elements/input';
import { ExcerptControls } from '@/components/form-elements/excerpt-controls';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { RichTextEditor } from '@/components/form-elements/rich-text-editor';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { PublishControls } from '@/components/admin/dashboard/common/publish-controls';
import { createService, updateService } from '@/actions/services';
import type { ServiceFormValues } from '@/lib/schemas/services';
import { normalizeAssetDefault } from '@/lib/assets/core';

type ServiceContentStored = {
  html?: string;
};

type ServiceEditInput = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  icon: string | null;
  content: Prisma.JsonValue;
  image: Prisma.JsonValue | null;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
};

function extractHtmlFromContent(value: Prisma.JsonValue): string {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'html' in value) {
    const html = (value as ServiceContentStored).html;
    return typeof html === 'string' ? html : '';
  }

  return '';
}

function PublicCheckbox({ checked }: { checked: boolean }) {
  return (
    <div className="form-check mt-2 mb-3">
      <input
        id="is_public"
        name="is_public"
        type="checkbox"
        className="form-check-input"
        defaultChecked={checked}
      />
      <label className="form-check-label" htmlFor="is_public">
        Public on website
      </label>
    </div>
  );
}

export function ServiceCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<ServiceFormValues>(
    createService.bind(null),
    {
      successMessage: 'Service created!',
      errorMessage: 'Failed to create service',
      redirectTo: '/dashboard/services',
    },
  );

  const defImage = normalizeAssetDefault(state?.values?.image);

  const excerptState = useExcerpt({
    initialBody: (state?.values?.content as string) ?? '',
    initialExcerpt: (state?.values?.excerpt as string) ?? '',
    maxLen: 220,
    autoFillDefault: true,
  });

  return (
    <CardWrapper2 headerLabel="New Service">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-7">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., Water Supply"
              defaultValue={state?.values?.title ?? ''}
              error={getError('title')}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label mb-1">Icon</label>
            <IconPicker
              defaultIcon={(state?.values?.icon as string | undefined) ?? null}
              hiddenFieldName="icon"
            />
            {getError('icon') ? (
              <div className="text-danger small mt-1">{getError('icon')}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <ExcerptControls
            excerpt={excerptState.excerpt}
            setExcerptAction={excerptState.setExcerpt}
            generated={excerptState.generated}
            autoFill={excerptState.autoFill}
            toggleAutoFillAction={excerptState.toggleAutoFill}
            error={getError('excerpt')}
          />
        </div>

        <div className="mb-3">
          <RichTextEditor
            name="content"
            label="Content *"
            defaultValue={(state?.values?.content as string) ?? ''}
            error={getError('content')}
            onChange={(html) => excerptState.setBodyHtml(html)}
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <FileDropzone
              mode="image"
              folder="/services"
              name="image"
              label="Service Image"
              defaultValue={defImage}
              error={getError('image')}
            />
          </div>
        </div>

        <PublishControls
          active={{
            name: 'is_active',
            checked: Boolean(state?.values?.is_active ?? true),
          }}
        />

        <PublicCheckbox checked={Boolean(state?.values?.is_public ?? true)} />

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function ServiceEditForm({ row }: { row: ServiceEditInput }) {
  const { formAction, pending, state, getError, formError } = useFormAction<ServiceFormValues>(
    updateService.bind(null, row.id),
    {
      successMessage: 'Service updated!',
      errorMessage: 'Failed to update service',
      redirectTo: '/dashboard/services',
    },
  );

  const defImage = normalizeAssetDefault(state?.values?.image ?? row.image);

  const activeDefault =
    typeof state?.values?.is_active === 'boolean' ? state.values.is_active : row.is_active;

  const publicDefault =
    typeof state?.values?.is_public === 'boolean' ? state.values.is_public : row.is_public;

  const editorDefault =
    (state?.values?.content as string | undefined) ?? extractHtmlFromContent(row.content);

  const excerptState = useExcerpt({
    initialBody: editorDefault,
    initialExcerpt: (state?.values?.excerpt as string) ?? row.excerpt ?? '',
    maxLen: 220,
    autoFillDefault: true,
  });

  return (
    <CardWrapper2 headerLabel="Edit Service">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-7">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., Water Supply"
              defaultValue={state?.values?.title ?? row.title}
              error={getError('title')}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label mb-1">Icon</label>
            <IconPicker
              defaultIcon={(state?.values?.icon as string | undefined) ?? row.icon ?? null}
              hiddenFieldName="icon"
            />
            {getError('icon') ? (
              <div className="text-danger small mt-1">{getError('icon')}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <ExcerptControls
            excerpt={excerptState.excerpt}
            setExcerptAction={excerptState.setExcerpt}
            generated={excerptState.generated}
            autoFill={excerptState.autoFill}
            toggleAutoFillAction={excerptState.toggleAutoFill}
            error={getError('excerpt')}
          />
        </div>

        <div className="mb-3">
          <RichTextEditor
            name="content"
            label="Content *"
            defaultValue={editorDefault}
            error={getError('content')}
            onChange={(html) => excerptState.setBodyHtml(html)}
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <FileDropzone
              mode="image"
              folder="/services"
              name="image"
              label="Service Image"
              defaultValue={defImage}
              error={getError('image')}
            />
          </div>
        </div>

        <PublishControls
          active={{
            name: 'is_active',
            checked: activeDefault,
          }}
        />

        <PublicCheckbox checked={publicDefault} />

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
