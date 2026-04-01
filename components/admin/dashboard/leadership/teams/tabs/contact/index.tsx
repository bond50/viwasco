'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import type { TeamSettingsData } from '@/lib/types/about/leadership';
import type { ManagementTeamContactValues } from '@/lib/schemas/about/content/leadership';
import { updateTeamMemberContact } from '@/actions/about/content/leadership';

type Props = { team: TeamSettingsData };

type TeamContactState = TeamSettingsData['contact'];

// only string fields
type TextKey = 'email' | 'phone' | 'expertiseArea' | 'officeLocation' | 'assistantContact';

export function TeamContactTab({ team }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<ManagementTeamContactValues>(updateTeamMemberContact.bind(null, team.id), {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    });

  const contact: TeamContactState = team.contact;
  const values = (state?.values ?? {}) as Partial<ManagementTeamContactValues>;

  const fromText = (key: TextKey): string => {
    const fromState = values[key];
    if (typeof fromState === 'string') return fromState;
    const orig = contact[key];
    return (orig as string | null) ?? '';
  };

  return (
    <form action={formAction} className="mb-3">
      {/* 1) Core contact */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="leader@example.com"
            defaultValue={fromText('email')}
            error={getError('email')}
          />
        </div>
        <div className="col-md-4">
          <Input
            name="phone"
            label="Phone"
            placeholder="+2547…"
            defaultValue={fromText('phone')}
            error={getError('phone')}
          />
        </div>
        <div className="col-md-4">
          <Input
            name="expertiseArea"
            label="Area of Expertise"
            placeholder="e.g. Finance & Planning"
            defaultValue={fromText('expertiseArea')}
            error={getError('expertiseArea')}
          />
        </div>
      </div>

      {/* 2) Office */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <Input
            name="officeLocation"
            label="Office / Station"
            placeholder="e.g. HQ – 3rd Floor, Room 12"
            defaultValue={fromText('officeLocation')}
            error={getError('officeLocation')}
          />
        </div>

        <div className="col-md-6">
          <Input
            name="assistantContact"
            label="Executive Assistant"
            placeholder="Name + phone/email (optional)"
            defaultValue={fromText('assistantContact')}
            error={getError('assistantContact')}
          />
        </div>
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
