import { WorkingHoursInput } from '@/components/form-elements/working-hours-input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { TeamContactState, type TeamSettingsData } from '@/lib/types/about/leadership';
import { useFormAction } from '@/hooks/use-form-action';
import { ManagementTeamContactValues } from '@/lib/schemas/about/content/leadership';
import { updateTeamMemberContact } from '@/actions/about/content/leadership';

type Props = { team: TeamSettingsData };
export function TeamWorkingHoursTab({ team }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ManagementTeamContactValues>(updateTeamMemberContact.bind(null, team.id), {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    });

  const contact: TeamContactState = team.contact;
  const values = (state?.values ?? {}) as Partial<ManagementTeamContactValues>;

  const workingHours = values.workingHours ?? contact.workingHours ?? null;

  return (
    <form action={formAction} className="mb-3">
      {/* Hidden fields so we don't accidentally clear other contact info
          and so the schema + superRefine still have what they need. */}
      <input type="hidden" name="email" value={contact.email ?? ''} />
      <input type="hidden" name="phone" value={contact.phone ?? ''} />
      <input type="hidden" name="expertiseArea" value={contact.expertiseArea ?? ''} />
      <input type="hidden" name="officeLocation" value={contact.officeLocation ?? ''} />
      <input type="hidden" name="assistantContact" value={contact.assistantContact ?? ''} />

      <input type="hidden" name="showEmail" value={contact.showEmail ? 'true' : 'false'} />
      <input type="hidden" name="showPhone" value={contact.showPhone ? 'true' : 'false'} />
      <input
        type="hidden"
        name="showSocialLinks"
        value={contact.showSocialLinks ? 'true' : 'false'}
      />
      <input type="hidden" name="allowContact" value={contact.allowContact ? 'true' : 'false'} />

      <div className="mb-2">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label className="form-label mb-0">Working Hours</label>
          <small className="text-muted">
            Used on the public profile, e.g. <em>Weekdays 8:00 AM – 5:00 PM</em>
          </small>
        </div>

        <WorkingHoursInput
          name="workingHours"
          defaultValue={workingHours ?? undefined}
          error={getError('workingHours')}
        />
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
