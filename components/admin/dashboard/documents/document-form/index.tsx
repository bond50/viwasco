'use client';

import type { Prisma } from '@/generated/prisma/client';

import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import { createOrgDocument, updateOrgDocument } from '@/actions/about/content/documents';

import type { AdminDocumentCategoryRow } from '@/lib/data/admin/about/content/document-categories';
import { ensureUploadedAsset } from '@/lib/assets/core';
import { OrgDocumentFormValues } from '@/lib/schemas/about/content/documents';

type CategoryOption = Pick<AdminDocumentCategoryRow, 'id' | 'name' | 'isActive'>;

type DocEditInput = {
  id: string;
  title: string;
  description: string | null;
  published: boolean;
  rank: number;
  categoryId: string | null;
  file: Prisma.JsonValue;
};

type BaseProps = {
  categories: CategoryOption[];
};

export function DocumentCreateForm({ categories }: BaseProps) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgDocumentFormValues>(
    createOrgDocument.bind(null),
    {
      successMessage: 'Document created!',
      errorMessage: 'Failed to create document',
      redirectTo: '/dashboard/about/documents',
    },
  );

  const selectedCategoryId = (state?.values?.categoryId as string | undefined) ?? '';

  return (
    <CardWrapper2 headerLabel="New Document">
      <form action={formAction}>
        {/* Title + Category */}
        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., Strategic Plan 2023–2027"
              defaultValue={state?.values?.title ?? ''}
              error={getError('title')}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select name="categoryId" className="form-select" defaultValue={selectedCategoryId}>
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                  {!cat.isActive ? ' (inactive)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="description"
              label="Short Description"
              as="textarea"
              placeholder="Optional description shown on the Resources / Downloads page"
              defaultValue={state?.values?.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>

        {/* File + Published */}
        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <FileDropzone
              mode="file"
              folder="/company/documents"
              name="file"
              label="Document file (PDF)"
              error={getError('file')}
            />
          </div>
          <div className="col-md-4 d-flex flex-column gap-3">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="document-published"
                name="published"
                defaultChecked={
                  typeof state?.values?.published === 'boolean' ? state.values.published : true
                }
              />
              <label className="form-check-label" htmlFor="document-published">
                Published (visible on website)
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

type EditProps = BaseProps & { doc: DocEditInput };

export function DocumentEditForm({ doc, categories }: EditProps) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgDocumentFormValues>(
    updateOrgDocument.bind(null, doc.id),
    {
      successMessage: 'Document updated!',
      errorMessage: 'Failed to update document',
      redirectTo: '/dashboard/about/documents',
    },
  );

  const defFile = ensureUploadedAsset(state?.values?.file ?? doc.file) ?? undefined;

  const selectedCategoryId =
    (state?.values?.categoryId as string | undefined) ?? doc.categoryId ?? '';

  const publishedChecked =
    typeof state?.values?.published === 'boolean' ? state.values.published : doc.published;

  return (
    <CardWrapper2 headerLabel="Edit Document">
      <form action={formAction}>
        {/* Title + Category */}
        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., Strategic Plan 2023–2027"
              defaultValue={state?.values?.title ?? doc.title}
              error={getError('title')}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select name="categoryId" className="form-select" defaultValue={selectedCategoryId}>
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                  {!cat.isActive ? ' (inactive)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="description"
              label="Short Description"
              as="textarea"
              placeholder="Optional description shown on the Resources / Downloads page"
              defaultValue={state?.values?.description ?? doc.description ?? ''}
              error={getError('description')}
            />
          </div>
        </div>

        {/* File + Published */}
        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <FileDropzone
              mode="file"
              folder="/company/documents"
              name="file"
              label="Document file (PDF)"
              defaultValue={defFile}
              error={getError('file')}
            />
          </div>
          <div className="col-md-4 d-flex flex-column gap-3">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="document-published"
                name="published"
                defaultChecked={publishedChecked}
              />
              <label className="form-check-label" htmlFor="document-published">
                Published (visible on website)
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
