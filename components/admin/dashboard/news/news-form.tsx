'use client';

import Link from 'next/link';

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
import { createNews, updateNews } from '@/actions/news';
import type { NewsFormValues } from '@/lib/schemas/news';
import { normalizeAssetDefault } from '@/lib/assets/core';

type NewsEditInput = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  hero_image: unknown;
  published_at: Date | null;
  is_active: boolean;
  sort_order: number;
};

type NewsCategoryOption = {
  id: string;
  label: string;
};

type FieldsProps = {
  state: { values?: Partial<NewsFormValues> } | undefined;
  getError: (field: keyof NewsFormValues) => string | undefined;
  fileDefault: ReturnType<typeof normalizeAssetDefault>;
  defaultPublishedAt?: Date | null;
  initialContent: string;
  initialExcerpt: string;
  defaultCategory?: string;
  defaultTitle?: string;
  categories: NewsCategoryOption[];
};

function NewsFields({
  state,
  getError,
  fileDefault,
  defaultPublishedAt,
  initialContent,
  initialExcerpt,
  defaultCategory,
  defaultTitle,
  categories,
}: FieldsProps) {
  const excerptState = useExcerpt({
    initialBody: (state?.values?.content as string) ?? initialContent,
    initialExcerpt: (state?.values?.excerpt as string) ?? initialExcerpt,
    maxLen: 220,
    autoFillDefault: true,
  });

  const publishedValue =
    state?.values?.published_at !== undefined ? state.values.published_at : defaultPublishedAt;

  const selectedCategory = state?.values?.category ?? defaultCategory ?? '';
  const categoryOptions =
    selectedCategory && !categories.some((item) => item.label === selectedCategory)
      ? [{ id: `current-${selectedCategory}`, label: selectedCategory }, ...categories]
      : categories;

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <Input
            name="title"
            label="Title *"
            placeholder="e.g., Malawi Delegation Benchmarking Visit"
            defaultValue={state?.values?.title ?? defaultTitle ?? ''}
            error={getError('title')}
          />
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
            <label className="form-label mb-0" htmlFor="category">
              Category *
            </label>
            <Link href="/dashboard/news/categories" className="small text-decoration-none">
              Manage categories
            </Link>
          </div>
          <select
            id="category"
            name="category"
            className="form-select"
            defaultValue={selectedCategory}
          >
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.label}>
                {category.label}
              </option>
            ))}
          </select>
          {getError('category') ? (
            <div className="invalid-feedback d-block">{getError('category')}</div>
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
            mode="image"
            folder="/news"
            name="hero_image"
            label="Hero Image"
            defaultValue={fileDefault}
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

export function NewsCreateForm({ categories }: { categories: NewsCategoryOption[] }) {
  const { formAction, pending, state, getError, formError } = useFormAction<NewsFormValues>(
    createNews.bind(null),
    {
      successMessage: 'News item created!',
      errorMessage: 'Failed to create news item',
      redirectTo: '/dashboard/news',
    },
  );

  const defFile = normalizeAssetDefault(state?.values?.hero_image);

  return (
    <CardWrapper2 headerLabel="New News Item">
      <form action={formAction}>
        <NewsFields
          state={state}
          getError={getError}
          fileDefault={defFile}
          initialContent=""
          initialExcerpt=""
          defaultTitle=""
          categories={categories}
        />
        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function NewsEditForm({
  row,
  categories,
}: {
  row: NewsEditInput;
  categories: NewsCategoryOption[];
}) {
  const { formAction, pending, state, getError, formError } = useFormAction<NewsFormValues>(
    updateNews.bind(null, row.id),
    {
      successMessage: 'News item updated!',
      errorMessage: 'Failed to update news item',
      redirectTo: '/dashboard/news',
    },
  );

  const defFile = normalizeAssetDefault(state?.values?.hero_image ?? row.hero_image);

  return (
    <CardWrapper2 headerLabel="Edit News Item">
      <form action={formAction}>
        <NewsFields
          state={state}
          getError={getError}
          fileDefault={defFile}
          defaultPublishedAt={row.published_at}
          initialContent={(state?.values?.content as string | undefined) ?? row.content}
          initialExcerpt={(state?.values?.excerpt as string | undefined) ?? row.excerpt}
          defaultCategory={row.category}
          defaultTitle={row.title}
          categories={categories}
        />
        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
