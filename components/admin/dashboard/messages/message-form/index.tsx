'use client';

import { useMemo } from 'react';
import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import {
  createOrgMessage,
  updateOrgMessage,
} from '@/actions/about/content/leadership/team-messages';
import type { OrgMessageFormValues } from '@/lib/types/about/content';
import { Select } from '@/components/form-elements/select';
import type { GenericOption } from '@/components/form-elements/select/types';

// TipTap (use your existing component as-is)
import { RichTextEditor } from '@/components/form-elements/rich-text-editor';

// Excerpt helpers (your provided pattern)
import { ExcerptControls } from '@/components/form-elements/excerpt-controls';
import { useExcerpt } from '@/hooks/use-excerpt';

type MessageEditInput = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  authorTeamId: string | null;
  published: boolean;
};

type PropsBase = {
  leaderOptions: GenericOption<string>[];
};

/* =========================
 * Create
 * =======================*/
export function MessageCreateForm({ leaderOptions }: PropsBase) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgMessageFormValues>(
    createOrgMessage.bind(null),
    {
      successMessage: 'Message created!',
      errorMessage: 'Failed to create messages',
      redirectTo: '/dashboard/about/messages',
    },
  );

  // Excerpt state (start empty)
  const excerptState = useExcerpt({
    initialBody: '',
    initialExcerpt: '',
    maxLen: 220,
    autoFillDefault: true,
  });

  // No preselected leader (keeps Select pristine)
  const defaultLeader = useMemo<GenericOption<string> | null>(() => null, []);

  return (
    <CardWrapper2 headerLabel="New Leadership Message">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., A Message from the CEO"
              defaultValue={state?.values?.title ?? ''}
              error={getError('title')}
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
                Published
              </label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <Select
            name="authorTeamId"
            label="Leader *"
            placeholder="Select leader"
            options={leaderOptions}
            defaultValue={defaultLeader ?? undefined}
            error={getError('authorTeamId')}
            isMulti={false}
          />
        </div>

        {/* TipTap Body (drives excerpt preview) */}
        <div className="mb-3">
          <RichTextEditor
            name="body"
            label="Body *"
            defaultValue={(state?.values?.body as string) ?? ''}
            error={getError('body')}
            onChange={(html) => excerptState.setBodyHtml(html)}
          />
        </div>

        {/* Excerpt controls (auto from body, or manual) */}
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

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

/* =========================
 * Edit
 * =======================*/
export function MessageEditForm({
  message,
  leaderOptions,
}: { message: MessageEditInput } & PropsBase) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgMessageFormValues>(
    updateOrgMessage.bind(null, message.id),
    {
      successMessage: 'Message updated!',
      errorMessage: 'Failed to update messages',
      redirectTo: '/dashboard/about/messages',
    },
  );

  // Initials come from state (post-validate) or from existing row
  const initialBody = (state?.values?.body as string) ?? message.body ?? '';
  const initialExcerpt = (state?.values?.excerpt as string) ?? message.excerpt ?? '';

  const excerptState = useExcerpt({
    initialBody,
    initialExcerpt,
    maxLen: 220,
    autoFillDefault: true,
  });

  const defaultLeader = useMemo<GenericOption<string> | null>(() => {
    const found = leaderOptions.find((o) => o.value === (message.authorTeamId ?? ''));
    return found ?? null;
  }, [leaderOptions, message.authorTeamId]);

  const publishedDefault =
    typeof state?.values?.published === 'boolean' ? state.values.published : message.published;

  return (
    <CardWrapper2 headerLabel="Edit Leadership Message">
      <form action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <Input
              name="title"
              label="Title *"
              placeholder="e.g., A Message from the CEO"
              defaultValue={state?.values?.title ?? message.title}
              error={getError('title')}
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
                Published
              </label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <Select
            name="authorTeamId"
            label="Leader *"
            placeholder="Select leader"
            options={leaderOptions}
            defaultValue={defaultLeader ?? undefined}
            error={getError('authorTeamId')}
            isMulti={false}
          />
        </div>

        {/* TipTap Body (drives excerpt preview) */}
        <div className="mb-3">
          <RichTextEditor
            name="body"
            label="Body *"
            defaultValue={initialBody}
            error={getError('body')}
            onChange={(html) => excerptState.setBodyHtml(html)}
          />
        </div>

        {/* Excerpt controls (auto from body, or manual) */}
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

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
