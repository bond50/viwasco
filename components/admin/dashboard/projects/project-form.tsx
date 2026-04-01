'use client';

import Link from 'next/link';
import type { Prisma, ProjectStatus } from '@/generated/prisma/client';

import { useFormAction } from '@/hooks/use-form-action';
import { useExcerpt } from '@/hooks/use-excerpt';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { ExcerptControls } from '@/components/form-elements/excerpt-controls';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { RichTextEditor } from '@/components/form-elements/rich-text-editor';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createProject, updateProject } from '@/actions/projects';
import type { ProjectFormValues } from '@/lib/schemas/projects';
import { normalizeAssetDefault } from '@/lib/assets/core';

type ProjectCategoryOption = {
  id: string;
  label: string;
};

type ProjectEditInput = {
  id: string;
  title: string;
  slug: string;
  categoryId: string | null;
  status: ProjectStatus;
  short_description: string;
  content: string;
  hero_image: Prisma.JsonValue | null;
  sort_order: number;
};

const STATUS_OPTIONS: Array<{ value: ProjectStatus; label: string }> = [
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
];

function ProjectTopFields({
  state,
  getError,
  defaultTitle,
  defaultStatus,
  categories,
  defaultCategoryId,
}: {
  state: { values?: Partial<ProjectFormValues> } | undefined;
  getError: (field: keyof ProjectFormValues) => string | undefined;
  defaultTitle: string;
  defaultStatus: ProjectStatus;
  categories: ProjectCategoryOption[];
  defaultCategoryId?: string;
}) {
  const selectedStatus = (state?.values?.status as ProjectStatus | undefined) ?? defaultStatus;
  const selectedCategoryId =
    (state?.values?.categoryId as string | undefined) ?? defaultCategoryId ?? '';

  return (
    <div className="row g-3 mb-3">
      <div className="col-md-6">
        <Input
          name="title"
          label="Title *"
          placeholder="e.g., Network Upgrade Phase 1"
          defaultValue={state?.values?.title ?? defaultTitle}
          error={getError('title')}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label" htmlFor="categoryId">
          Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          className="form-select"
          defaultValue={selectedCategoryId}
        >
          <option value="">Select category</option>
          {categories.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {getError('categoryId') ? (
          <div className="invalid-feedback d-block">{getError('categoryId')}</div>
        ) : null}
        <div className="form-text">
          Need a different category?{' '}
          <Link href="/dashboard/projects/categories">Manage categories</Link>
        </div>
      </div>

      <div className="col-md-3">
        <label className="form-label" htmlFor="status">
          Status *
        </label>
        <select id="status" name="status" className="form-select" defaultValue={selectedStatus}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {getError('status') ? (
          <div className="invalid-feedback d-block">{getError('status')}</div>
        ) : null}
      </div>
    </div>
  );
}

function ProjectBodyFields({
  state,
  getError,
  imageDefault,
  initialContent,
  initialShortDescription,
}: {
  state: { values?: Partial<ProjectFormValues> } | undefined;
  getError: (field: keyof ProjectFormValues) => string | undefined;
  imageDefault: ReturnType<typeof normalizeAssetDefault>;
  initialContent: string;
  initialShortDescription: string;
}) {
  const excerptState = useExcerpt({
    initialBody: (state?.values?.content as string) ?? initialContent,
    initialExcerpt: (state?.values?.short_description as string) ?? initialShortDescription,
    maxLen: 220,
    autoFillDefault: true,
  });

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <ExcerptControls
            name="short_description"
            excerpt={excerptState.excerpt}
            setExcerptAction={excerptState.setExcerpt}
            generated={excerptState.generated}
            autoFill={excerptState.autoFill}
            toggleAutoFillAction={excerptState.toggleAutoFill}
            error={getError('short_description')}
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <RichTextEditor
            name="content"
            label="Content *"
            placeholder="Describe the project scope, purpose, milestones, and expected impact."
            defaultValue={(state?.values?.content as string) ?? initialContent}
            error={getError('content')}
            onChange={(html) => excerptState.setBodyHtml(html)}
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <FileDropzone
            mode="image"
            folder="/projects"
            name="hero_image"
            label="Hero Image"
            defaultValue={imageDefault}
            error={getError('hero_image')}
          />
        </div>
      </div>
    </>
  );
}

export function ProjectCreateForm({ categories }: { categories: ProjectCategoryOption[] }) {
  const { formAction, pending, state, getError, formError } = useFormAction<ProjectFormValues>(
    createProject.bind(null),
    {
      successMessage: 'Project created!',
      errorMessage: 'Failed to create project',
      redirectTo: '/dashboard/projects',
    },
  );

  const defImage = normalizeAssetDefault(state?.values?.hero_image);

  return (
    <CardWrapper2 headerLabel="New Project">
      <form action={formAction}>
        <ProjectTopFields
          state={state}
          getError={getError}
          defaultTitle=""
          defaultStatus="ONGOING"
          categories={categories}
        />

        <ProjectBodyFields
          state={state}
          getError={getError}
          imageDefault={defImage}
          initialContent=""
          initialShortDescription=""
        />

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function ProjectEditForm({
  row,
  categories,
}: {
  row: ProjectEditInput;
  categories: ProjectCategoryOption[];
}) {
  const { formAction, pending, state, getError, formError } = useFormAction<ProjectFormValues>(
    updateProject.bind(null, row.id),
    {
      successMessage: 'Project updated!',
      errorMessage: 'Failed to update project',
      redirectTo: '/dashboard/projects',
    },
  );

  const defImage = normalizeAssetDefault(state?.values?.hero_image ?? row.hero_image);
  const contentDefault = (state?.values?.content as string | undefined) ?? row.content;
  const shortDescriptionDefault =
    (state?.values?.short_description as string | undefined) ?? row.short_description;
  const categoryOptions =
    row.categoryId && !categories.some((item) => item.id === row.categoryId)
      ? [{ id: row.categoryId, label: 'Current category' }, ...categories]
      : categories;

  return (
    <CardWrapper2 headerLabel="Edit Project">
      <form action={formAction}>
        <ProjectTopFields
          state={state}
          getError={getError}
          defaultTitle={row.title}
          defaultStatus={row.status}
          categories={categoryOptions}
          defaultCategoryId={row.categoryId ?? undefined}
        />

        <ProjectBodyFields
          state={state}
          getError={getError}
          imageDefault={defImage}
          initialContent={contentDefault}
          initialShortDescription={shortDescriptionDefault}
        />

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
