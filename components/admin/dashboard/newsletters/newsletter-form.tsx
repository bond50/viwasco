'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useExcerpt } from '@/hooks/use-excerpt';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { ExcerptControls } from '@/components/form-elements/excerpt-controls';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { RichTextEditor } from '@/components/form-elements/rich-text-editor';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { PublishControls } from '@/components/admin/dashboard/common/publish-controls';
import { createNewsletter, updateNewsletter } from '@/actions/newsletters';
import type { NewsletterFormValues } from '@/lib/schemas/newsletters';
import { normalizeAssetDefault } from '@/lib/assets/core';
import type { NewsletterCategory } from '@/lib/data/admin/newsletters/categories';

type NewsletterEditInput = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  file: unknown;
  hero_image: unknown;
  published_at: Date | null;
  downloads: number;
  size_mb: number;
  is_active: boolean;
  sort_order: number;
};

function toDateInput(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function NewsletterFields({
  state,
  getError,
  categories,
  fileDefault,
  heroDefault,
  defaultCategoryId,
  defaultPublishedAt,
  initialContent,
  initialExcerpt,
}: {
  state: { values?: Partial<NewsletterFormValues> } | undefined;
  getError: (field: keyof NewsletterFormValues) => string | undefined;
  categories: NewsletterCategory[];
  fileDefault: ReturnType<typeof normalizeAssetDefault>;
  heroDefault: ReturnType<typeof normalizeAssetDefault>;
  defaultCategoryId?: string;
  defaultPublishedAt?: Date | null;
  initialContent: string;
  initialExcerpt: string;
}) {
  const categoryValue =
    (state?.values?.categoryId as string | undefined) ?? defaultCategoryId ?? '';
  const publishedValue =
    state?.values?.published_at !== undefined
      ? toDateInput(state.values.published_at)
      : toDateInput(defaultPublishedAt);
  const excerptState = useExcerpt({
    initialBody: (state?.values?.content as string) ?? initialContent,
    initialExcerpt: (state?.values?.excerpt as string) ?? initialExcerpt,
    maxLen: 220,
    autoFillDefault: true,
  });

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <Input
            name="title"
            label="Title *"
            placeholder="e.g., February 2026 Community Update"
            defaultValue={state?.values?.title ?? ''}
            error={getError('title')}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="categoryId">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="form-select"
            defaultValue={categoryValue}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          {getError('categoryId') ? (
            <div className="invalid-feedback d-block">{getError('categoryId')}</div>
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
          defaultValue={(state?.values?.content as string) ?? initialContent}
          error={getError('content')}
          onChange={(html) => excerptState.setBodyHtml(html)}
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <FileDropzone
            mode="file"
            folder="/newsletters"
            name="file"
            label="Newsletter File"
            defaultValue={fileDefault}
            error={getError('file')}
          />
        </div>
        <div className="col-md-6">
          <FileDropzone
            mode="image"
            folder="/newsletters"
            name="hero_image"
            label="Hero Image"
            defaultValue={heroDefault}
            error={getError('hero_image')}
          />
        </div>
      </div>

      <PublishControls
        publishedAt={{ name: 'published_at', value: publishedValue }}
        active={{ name: 'is_active', checked: Boolean(state?.values?.is_active ?? true) }}
      />
    </>
  );
}

export function NewsletterCreateForm({ categories }: { categories: NewsletterCategory[] }) {
  const { formAction, pending, state, getError, formError } = useFormAction<NewsletterFormValues>(
    createNewsletter.bind(null),
    {
      successMessage: 'Newsletter created!',
      errorMessage: 'Failed to create newsletter',
      redirectTo: '/dashboard/newsletters',
    },
  );
  const defFile = normalizeAssetDefault(state?.values?.file);
  const defHero = normalizeAssetDefault(state?.values?.hero_image);

  return (
    <CardWrapper2 headerLabel="New Newsletter">
      <form action={formAction}>
        <NewsletterFields
          state={state}
          getError={getError}
          categories={categories}
          fileDefault={defFile}
          heroDefault={defHero}
          initialContent=""
          initialExcerpt=""
        />
        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function NewsletterEditForm({
  row,
  categories,
}: {
  row: NewsletterEditInput;
  categories: NewsletterCategory[];
}) {
  const { formAction, pending, state, getError, formError } = useFormAction<NewsletterFormValues>(
    updateNewsletter.bind(null, row.id),
    {
      successMessage: 'Newsletter updated!',
      errorMessage: 'Failed to update newsletter',
      redirectTo: '/dashboard/newsletters',
    },
  );
  const defFile = normalizeAssetDefault(state?.values?.file ?? row.file);
  const defHero = normalizeAssetDefault(state?.values?.hero_image ?? row.hero_image);
  const contentDefault = (state?.values?.content as string | undefined) ?? row.content;
  const excerptDefault = (state?.values?.excerpt as string | undefined) ?? row.excerpt;

  return (
    <CardWrapper2 headerLabel="Edit Newsletter">
      <form action={formAction}>
        <NewsletterFields
          state={state}
          getError={getError}
          categories={categories}
          fileDefault={defFile}
          heroDefault={defHero}
          defaultCategoryId={row.categoryId}
          defaultPublishedAt={row.published_at}
          initialContent={contentDefault}
          initialExcerpt={excerptDefault}
        />
        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
