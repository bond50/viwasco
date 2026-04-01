'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createOrgTestimonial, updateOrgTestimonial } from '@/actions/about/content/testimonials';
import type { OrgTestimonialFormValues } from '@/lib/types/about/content';

import { Prisma } from '@/generated/prisma/client';
import { ensureUploadedAsset } from '@/lib/assets/core';

type TestimonialEditInput = {
  id: string;
  authorName: string;
  authorRole: string | null;
  message: string;
  avatar: Prisma.JsonValue | null;
  published: boolean;
  rank: number;
};

function normalizeAvatarDefault(raw: unknown) {
  const asset = ensureUploadedAsset(raw);
  return asset ?? undefined;
}
export function TestimonialCreateForm() {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrgTestimonialFormValues>(createOrgTestimonial.bind(null), {
      successMessage: 'Testimonial created!',
      errorMessage: 'Failed to create testimonial',
      redirectTo: '/dashboard/about/testimonials',
    });
  const formKey = useRemountOnRefresh(state?.success, state?.success);

  const defAvatar = normalizeAvatarDefault(state?.values?.avatar);

  return (
    <CardWrapper2 headerLabel="New Testimonial">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <Input
              name="authorName"
              label="Author Name *"
              placeholder="e.g., Jane Doe"
              defaultValue={state?.values?.authorName ?? ''}
              error={getError('authorName')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="authorRole"
              label="Author Role"
              placeholder="e.g., Customer"
              defaultValue={state?.values?.authorRole ?? ''}
              error={getError('authorRole')}
            />
          </div>
          <div className="col-md-4">
            <div className="form-check mt-4 pt-2">
              <input
                id="published"
                name="published"
                type="checkbox"
                className="form-check-input"
                defaultChecked={Boolean(state?.values?.published ?? true)}
              />
              <label className="form-check-label" htmlFor="published">
                Published (visible on site)
              </label>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="message"
              as="textarea"
              label="Message *"
              placeholder="Write the testimonial..."
              defaultValue={state?.values?.message ?? ''}
              error={getError('message')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="image"
              folder="/company/testimonials"
              name="avatar"
              label="Avatar Image"
              defaultValue={defAvatar}
              error={getError('avatar')}
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

export function TestimonialEditForm({ testimonial }: { testimonial: TestimonialEditInput }) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrgTestimonialFormValues>(updateOrgTestimonial.bind(null, testimonial.id), {
      successMessage: 'Testimonial updated!',
      errorMessage: 'Failed to update testimonial',
      redirectTo: '/dashboard/about/testimonials',
    });
  const formKey = useRemountOnRefresh(state?.success, testimonial);

  const defAvatar = normalizeAvatarDefault(state?.values?.avatar ?? testimonial.avatar);
  const publishedDefault =
    typeof state?.values?.published === 'boolean' ? state.values.published : testimonial.published;

  return (
    <CardWrapper2 headerLabel="Edit Testimonial">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <Input
              name="authorName"
              label="Author Name *"
              placeholder="e.g., Jane Doe"
              defaultValue={state?.values?.authorName ?? testimonial.authorName}
              error={getError('authorName')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="authorRole"
              label="Author Role"
              placeholder="e.g., Customer"
              defaultValue={state?.values?.authorRole ?? testimonial.authorRole ?? ''}
              error={getError('authorRole')}
            />
          </div>
          <div className="col-md-4">
            <div className="form-check mt-4 pt-2">
              <input
                id="published"
                name="published"
                type="checkbox"
                className="form-check-input"
                defaultChecked={publishedDefault}
              />
              <label className="form-check-label" htmlFor="published">
                Published (visible on site)
              </label>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="message"
              as="textarea"
              label="Message *"
              placeholder="Write the testimonial..."
              defaultValue={state?.values?.message ?? testimonial.message}
              error={getError('message')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <FileDropzone
              mode="image"
              folder="/company/testimonials"
              name="avatar"
              label="Avatar Image"
              defaultValue={defAvatar}
              error={getError('avatar')}
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
