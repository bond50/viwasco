'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createOrgFaq, updateOrgFaq } from '@/actions/about/content/faqs';
import type { OrgFaqFormValues } from '@/lib/types/about/content';

type FaqEditInput = {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  rank: number;
};

export function FaqCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgFaqFormValues>(
    createOrgFaq.bind(null),
    {
      successMessage: 'FAQ created!',
      errorMessage: 'Failed to create FAQ',
      redirectTo: '/dashboard/about/faqs',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, state?.success);

  return (
    <CardWrapper2 headerLabel="New FAQ">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="question"
              label="Question *"
              placeholder="e.g., How do I apply for a new water connection?"
              defaultValue={state?.values?.question ?? ''}
              error={getError('question')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="answer"
              as="textarea"
              label="Answer *"
              placeholder="Provide a clear, concise answer..."
              defaultValue={state?.values?.answer ?? ''}
              error={getError('answer')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <div className="form-check">
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

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function FaqEditForm({ faq }: { faq: FaqEditInput }) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgFaqFormValues>(
    updateOrgFaq.bind(null, faq.id),
    {
      successMessage: 'FAQ updated!',
      errorMessage: 'Failed to update FAQ',
      redirectTo: '/dashboard/about/faqs',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, faq);

  const publishedDefault =
    typeof state?.values?.published === 'boolean' ? state.values.published : faq.published;

  return (
    <CardWrapper2 headerLabel="Edit FAQ">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="question"
              label="Question *"
              placeholder="e.g., How do I apply for a new water connection?"
              defaultValue={state?.values?.question ?? faq.question}
              error={getError('question')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <Input
              name="answer"
              as="textarea"
              label="Answer *"
              placeholder="Provide a clear, concise answer..."
              defaultValue={state?.values?.answer ?? faq.answer}
              error={getError('answer')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <div className="form-check">
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

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
