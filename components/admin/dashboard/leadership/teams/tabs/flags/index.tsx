'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import type { TeamSettingsData } from '@/lib/types/about/leadership';
import type { ManagementTeamFlagsValues } from '@/lib/schemas/about/content/leadership';
import { updateTeamMemberFlags } from '@/actions/about/content/leadership/team-flags';

type Props = { team: TeamSettingsData };

export function TeamFlagsTab({ team }: Props) {
  const { formAction, pending, state, formError } = useFormAction<ManagementTeamFlagsValues>(
    updateTeamMemberFlags.bind(null, team.id),
    {
      successMessage: 'Flags saved',
      errorMessage: 'Failed to save flags',
    },
  );

  const values = (state?.values ?? {}) as Partial<ManagementTeamFlagsValues>;

  const boolFrom = (key: keyof ManagementTeamFlagsValues, fallback: boolean) =>
    typeof values[key] === 'boolean' ? (values[key] as boolean) : fallback;

  // ✅ FIXED: Get visibility flags from metadata instead of defaulting to true
  const metadata = team.metadata as {
    visibilityFlags?: {
      showBio?: boolean;
      showWorkingHours?: boolean;
      showEducation?: boolean;
      showExperience?: boolean;
      showAchievements?: boolean;
      showPublications?: boolean;
      showLists?: boolean;
    };
  } | null;

  const visibilityFlags = metadata?.visibilityFlags ?? {};

  const flags = {
    // Core status
    isFeatured: boolFrom('isFeatured', team.basic.isFeatured),
    isActive: boolFrom('isActive', team.basic.isActive),

    // Contact visibility
    showEmail: boolFrom('showEmail', team.contact.showEmail),
    showPhone: boolFrom('showPhone', team.contact.showPhone),
    showSocialLinks: boolFrom('showSocialLinks', team.contact.showSocialLinks),
    allowContact: boolFrom('allowContact', team.contact.allowContact),

    // ✅ FIXED: Section visibility — read from metadata, default to true only if undefined
    showBio: boolFrom('showBio', visibilityFlags.showBio ?? true),
    showWorkingHours: boolFrom('showWorkingHours', visibilityFlags.showWorkingHours ?? true),
    showEducation: boolFrom('showEducation', visibilityFlags.showEducation ?? true),
    showExperience: boolFrom('showExperience', visibilityFlags.showExperience ?? true),
    showAchievements: boolFrom('showAchievements', visibilityFlags.showAchievements ?? true),
    showPublications: boolFrom('showPublications', visibilityFlags.showPublications ?? true),
    showLists: boolFrom('showLists', visibilityFlags.showLists ?? true),
  };

  return (
    <form action={formAction} className="mb-3">
      <div className="row g-3">
        {/* STATUS */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title mb-2">Status</h6>
              <p className="text-muted small mb-3">
                Control whether this leader is active and highlighted.
              </p>

              <div className="form-check mb-2">
                <input
                  id="flag-isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.isFeatured}
                />
                <label className="form-check-label small" htmlFor="flag-isFeatured">
                  Featured
                </label>
              </div>

              <div className="form-check">
                <input
                  id="flag-isActive"
                  name="isActive"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.isActive}
                />
                <label className="form-check-label small" htmlFor="flag-isActive">
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT VISIBILITY */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title mb-2">Contact & Social</h6>
              <p className="text-muted small mb-3">
                Control what appears on the public profile contact block.
              </p>

              <div className="form-check mb-2">
                <input
                  id="flag-showEmail"
                  name="showEmail"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showEmail}
                />
                <label className="form-check-label small" htmlFor="flag-showEmail">
                  Show email publicly
                </label>
              </div>

              <div className="form-check mb-2">
                <input
                  id="flag-showPhone"
                  name="showPhone"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showPhone}
                />
                <label className="form-check-label small" htmlFor="flag-showPhone">
                  Show phone publicly
                </label>
              </div>

              <div className="form-check mb-2">
                <input
                  id="flag-showSocialLinks"
                  name="showSocialLinks"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showSocialLinks}
                />
                <label className="form-check-label small" htmlFor="flag-showSocialLinks">
                  Show social links
                </label>
              </div>

              <div className="form-check">
                <input
                  id="flag-allowContact"
                  name="allowContact"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.allowContact}
                />
                <label className="form-check-label small" htmlFor="flag-allowContact">
                  Enable contact form (requires email)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION VISIBILITY */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title mb-2">Profile Sections</h6>
              <p className="text-muted small mb-3">
                Toggle which sections appear on the public profile.
              </p>

              <div className="form-check mb-1">
                <input
                  id="flag-showBio"
                  name="showBio"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showBio}
                />
                <label className="form-check-label small" htmlFor="flag-showBio">
                  Show biography
                </label>
              </div>

              <div className="form-check mb-1">
                <input
                  id="flag-showWorkingHours"
                  name="showWorkingHours"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showWorkingHours}
                />
                <label className="form-check-label small" htmlFor="flag-showWorkingHours">
                  Show working hours
                </label>
              </div>

              <div className="form-check mb-1">
                <input
                  id="flag-showEducation"
                  name="showEducation"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showEducation}
                />
                <label className="form-check-label small" htmlFor="flag-showEducation">
                  Show education history
                </label>
              </div>

              <div className="form-check mb-1">
                <input
                  id="flag-showExperience"
                  name="showExperience"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showExperience}
                />
                <label className="form-check-label small" htmlFor="flag-showExperience">
                  Show experience
                </label>
              </div>

              <div className="form-check mb-1">
                <input
                  id="flag-showAchievements"
                  name="showAchievements"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showAchievements}
                />
                <label className="form-check-label small" htmlFor="flag-showAchievements">
                  Show achievements
                </label>
              </div>

              <div className="form-check mb-1">
                <input
                  id="flag-showPublications"
                  name="showPublications"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showPublications}
                />
                <label className="form-check-label small" htmlFor="flag-showPublications">
                  Show publications
                </label>
              </div>

              <div className="form-check mb-1">
                <input
                  id="flag-showLists"
                  name="showLists"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={flags.showLists}
                />
                <label className="form-check-label small" htmlFor="flag-showLists">
                  Show languages & committees lists
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormError message={formError ?? undefined} />

      <div className="d-flex justify-content-end gap-2 mt-3">
        <SaveUpdateButton isEdit pending={pending} variant="primary" />
      </div>
    </form>
  );
}
