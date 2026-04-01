'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { Input } from '@/components/form-elements/input';
import { IconPicker } from '@/components/icons/IconPicker';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { OrganisationVisionMissionValues } from '@/lib/schemas/about/organization/vision-mission';
import { VisionMissionState } from '@/lib/types/about';
import { updateOrganizationVisionMission } from '@/actions/organization';

type Props = { orgId: string; initial: VisionMissionState };

export function VisionMissionTab({ orgId, initial }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrganisationVisionMissionValues>(
      updateOrganizationVisionMission.bind(null, orgId),
      {
        successMessage: 'Saved',
        errorMessage: 'Failed to save',
      },
    );
  const formKey = useRemountOnRefresh(state?.success, initial);

  const visionIcon = state?.values?.visionIcon ?? initial.visionIcon ?? null;
  const missionIcon = state?.values?.missionIcon ?? initial.missionIcon ?? null;

  return (
    <form key={formKey} action={formAction}>
      <div className="row mb-3">
        <div className="col-md-12">
          <Input
            name="vision"
            label="Vision"
            as="textarea"
            placeholder="Vision statement"
            defaultValue={state?.values?.vision ?? initial.vision ?? ''}
            error={getError('vision')}
          />
          <div className="mt-2">
            <label className="form-label mb-1">Vision Icon</label>
            <IconPicker defaultIcon={visionIcon} hiddenFieldName="visionIcon" />
          </div>
        </div>
        <div className="col-md-12">
          <Input
            name="mission"
            label="Mission"
            placeholder="Mission statement"
            as="textarea"
            defaultValue={state?.values?.mission ?? initial.mission ?? ''}
            error={getError('mission')}
          />
          <div className="mt-2">
            <label className="form-label mb-1">Mission Icon</label>
            <IconPicker defaultIcon={missionIcon} hiddenFieldName="missionIcon" />
          </div>
        </div>
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
