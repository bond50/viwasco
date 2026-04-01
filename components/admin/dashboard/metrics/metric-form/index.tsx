'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { createOrgMetric, updateOrgMetric } from '@/actions/about/content/metrics';
import type { OrgMetricFormValues } from '@/lib/types/about/content';
import { IconPicker } from '@/components/icons/IconPicker';

type MetricEditInput = {
  id: string;
  label: string;
  value: number;
  unit: string | null;
  icon: string | null; // canonical key like "md:MdWaterDrop"
  published: boolean;
  rank: number;
};

export function MetricCreateForm() {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgMetricFormValues>(
    createOrgMetric.bind(null),
    {
      successMessage: 'Metric created!',
      errorMessage: 'Failed to create metric',
      redirectTo: '/dashboard/about/metrics',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, state?.success);

  return (
    <CardWrapper2 headerLabel="New Metric">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <Input
              name="label"
              label="Label *"
              placeholder="e.g., Connections"
              defaultValue={state?.values?.label ?? ''}
              error={getError('label')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="value"
              type="number"
              label="Value *"
              placeholder="e.g., 12000"
              defaultValue={
                typeof state?.values?.value === 'number' ? String(state.values.value) : ''
              }
              error={getError('value')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="unit"
              label="Unit"
              placeholder="e.g., connections, m³/day, %"
              defaultValue={state?.values?.unit ?? ''}
              error={getError('unit')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            {/* IconPicker writes canonical key to hidden input "icon" */}
            <IconPicker
              defaultIcon={(state?.values?.icon as string | null) ?? null}
              hiddenFieldName="icon"
            />
            {getError('icon') ? (
              <div className="invalid-feedback d-block mt-1">{getError('icon')}</div>
            ) : null}
          </div>
          <div className="col-md-12">
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

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit={false} pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}

export function MetricEditForm({ metric }: { metric: MetricEditInput }) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrgMetricFormValues>(
    updateOrgMetric.bind(null, metric.id),
    {
      successMessage: 'Metric updated!',
      errorMessage: 'Failed to update metric',
      redirectTo: '/dashboard/about/metrics',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, metric);

  const publishedDefault =
    typeof state?.values?.published === 'boolean' ? state.values.published : metric.published;

  return (
    <CardWrapper2 headerLabel="Edit Metric">
      <form key={formKey} action={formAction}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <Input
              name="label"
              label="Label *"
              defaultValue={state?.values?.label ?? metric.label}
              error={getError('label')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="value"
              type="number"
              label="Value *"
              defaultValue={
                typeof state?.values?.value === 'number'
                  ? String(state.values.value)
                  : String(metric.value)
              }
              error={getError('value')}
            />
          </div>
          <div className="col-md-4">
            <Input
              name="unit"
              label="Unit"
              defaultValue={state?.values?.unit ?? metric.unit ?? ''}
              error={getError('unit')}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-12">
            <IconPicker
              defaultIcon={
                (state?.values?.icon as string | null) ?? (metric.icon as string | null) ?? null
              }
              hiddenFieldName="icon"
            />
            {getError('icon') ? (
              <div className="invalid-feedback d-block mt-1">{getError('icon')}</div>
            ) : null}
          </div>
          <div className="col-md-12">
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

        <FormError message={formError ?? undefined} />
        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
