'use client';

import { CoreValuesInput } from '@/components/admin/dashboard/values/core-values-input';
import { CardWrapper2 } from '@/components/card/card-2';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { useFormAction } from '@/hooks/use-form-action';
import { saveOrgCoreValues } from '@/actions/about/content/values';

type Props = { defaultValuesJson: string };

export function CoreValuesForm({ defaultValuesJson }: Props) {
  const { formAction, pending, state, formError } = useFormAction(saveOrgCoreValues.bind(null), {
    successMessage: 'Core core-values saved!',
    errorMessage: 'Failed to save core core-values',
  });

  return (
    <CardWrapper2 headerLabel="Core Values">
      <form action={formAction}>
        <CoreValuesInput
          name="coreValues"
          defaultValue={JSON.parse(defaultValuesJson)}
          errors={
            state?.errors as
              | {
                  leadText?: string[];
                  values?: Record<string, string[]>[];
                  coreValuesImage?: string;
                }
              | undefined
          }
        />

        {formError ? <div className="text-danger small mb-2">{formError}</div> : null}

        <div className="d-flex justify-content-end">
          <SaveUpdateButton isEdit pending={pending} variant="primary" />
        </div>
      </form>
    </CardWrapper2>
  );
}
