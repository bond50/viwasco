// components/admin/dashboard/organization/tabs/hero-settings/index.tsx
'use client';

import React from 'react';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { updateOrganizationHero } from '@/actions/organization/hero';
import type { OrganizationHeroValues } from '@/lib/schemas/about/organization/hero';
import type { HeroState } from '@/lib/types/about';

import { HeroDevicesRow } from '@/components/admin/dashboard/organization/tabs/hero-settings/rows/devices-row';
import { HeroVisibilityRow } from '@/components/admin/dashboard/organization/tabs/hero-settings/rows/visibility-row';
import { HeroTypeRow } from '@/components/admin/dashboard/organization/tabs/hero-settings/rows/hero-type-row';
import { HeroVariantRow } from '@/components/admin/dashboard/organization/tabs/hero-settings/rows/variant-row';
import { HeroTextStyleRow } from '@/components/admin/dashboard/organization/tabs/hero-settings/rows/text-style-row';
import { HeroContentModeRow } from '@/components/admin/dashboard/organization/tabs/hero-settings/rows/content-mode-row';
import { HeroTextMappingHelpRow } from '@/components/admin/dashboard/organization/tabs/hero-settings/rows/text-mapping-help-row';
import { HeroFineTuningRow } from '@/components/admin/dashboard/organization/tabs/hero-settings/rows/fine-tuning-row';
import { HeroMediaSection } from '@/components/admin/dashboard/organization/tabs/hero-settings/media-section';

type Props = { orgId: string; initial: HeroState };
type HeroContentMode = HeroState['contentMode'];

// Local defaults (same as backend DESKTOP_DEFAULT / MOBILE_DEFAULT)
const DESKTOP_DEFAULT: HeroState['desktop'] = {
  show: true,
  useVideo: true,
  textAlign: 'left',
  textChrome: 'plain',
  showScrollCue: true,
  overlayStrength: 'medium',
};

const MOBILE_DEFAULT: HeroState['mobile'] = {
  show: true,
  useVideo: false,
  textAlign: 'center',
  textChrome: 'plain',
  showScrollCue: true,
  overlayStrength: 'soft',
};

export function HomepageHeroTab({ orgId, initial }: Props) {
  const { formAction, pending, state, getError, formError } = useFormAction<OrganizationHeroValues>(
    updateOrganizationHero.bind(null, orgId),
    {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    },
  );
  const formKey = useRemountOnRefresh(state?.success, initial);

  // Base initial (from props or from a local override)
  const baseInitial: HeroState = initial;

  // SAFETY: normalise initial so desktop/mobile are NEVER undefined
  const safeInitial: HeroState = {
    ...baseInitial,
    desktop: baseInitial.desktop ?? DESKTOP_DEFAULT,
    mobile: baseInitial.mobile ?? MOBILE_DEFAULT,
  };

  const values = state?.values;

  // Enabled
  const enabledInitial =
    typeof values?.enabled === 'boolean' ? values.enabled : safeInitial.enabled;
  const [enabledState, setEnabledState] = React.useState<boolean>(enabledInitial);

  React.useEffect(() => {
    setEnabledState(enabledInitial);
  }, [enabledInitial]);

  // Device: useVideo
  const desktopUseVideoInitial =
    typeof values?.desktopUseVideo === 'boolean'
      ? values.desktopUseVideo
      : safeInitial.desktop.useVideo;

  const mobileUseVideoInitial =
    typeof values?.mobileUseVideo === 'boolean'
      ? values.mobileUseVideo
      : safeInitial.mobile.useVideo;

  const [desktopUseVideo, setDesktopUseVideo] = React.useState<boolean>(desktopUseVideoInitial);
  const [mobileUseVideo, setMobileUseVideo] = React.useState<boolean>(mobileUseVideoInitial);

  React.useEffect(() => {
    setDesktopUseVideo(desktopUseVideoInitial);
  }, [desktopUseVideoInitial]);

  React.useEffect(() => {
    setMobileUseVideo(mobileUseVideoInitial);
  }, [mobileUseVideoInitial]);

  // Content mode (global for now – applies to the hero structure overall)
  const contentModeInitial: HeroContentMode =
    (values?.contentMode as HeroContentMode | undefined) ?? safeInitial.contentMode ?? 'single';

  const [contentModeState, setContentModeState] =
    React.useState<HeroContentMode>(contentModeInitial);

  React.useEffect(() => {
    setContentModeState(contentModeInitial);
  }, [contentModeInitial]);

  const primaryUseVideo = desktopUseVideo;

  // Device: show
  const desktopShowDefault =
    typeof values?.desktopShow === 'boolean' ? values.desktopShow : safeInitial.desktop.show;

  const mobileShowDefault =
    typeof values?.mobileShow === 'boolean' ? values.mobileShow : safeInitial.mobile.show;

  // Text layout
  const desktopAlignDefault = values?.desktopTextAlign ?? safeInitial.desktop.textAlign;
  const desktopChromeDefault = values?.desktopTextChrome ?? safeInitial.desktop.textChrome;

  const mobileAlignDefault = values?.mobileTextAlign ?? safeInitial.mobile.textAlign;
  const mobileChromeDefault = values?.mobileTextChrome ?? safeInitial.mobile.textChrome;

  // Fine tuning
  const desktopScrollCueDefault =
    typeof values?.desktopShowScrollCue === 'boolean'
      ? values.desktopShowScrollCue
      : safeInitial.desktop.showScrollCue;

  const mobileScrollCueDefault =
    typeof values?.mobileShowScrollCue === 'boolean'
      ? values.mobileShowScrollCue
      : safeInitial.mobile.showScrollCue;

  const desktopOverlayDefault =
    (values?.desktopOverlayStrength as HeroState['desktop']['overlayStrength'] | undefined) ??
    safeInitial.desktop.overlayStrength;

  const mobileOverlayDefault =
    (values?.mobileOverlayStrength as HeroState['mobile']['overlayStrength'] | undefined) ??
    safeInitial.mobile.overlayStrength;

  // Text previews – always from initial (derived from other tabs)
  const headingPreview = (safeInitial.heading ?? '') || '(from Identity / Introduction)';
  const subheadingPreview =
    safeInitial.subheading ?? '(Introductory Description from Introduction section)';
  const kickerPreview =
    safeInitial.kicker ?? '(Tagline from Basic / Identity section, used as small overline)';

  const videoUrlCurrent = values?.videoSrc ?? safeInitial.videoSrc ?? '';

  const variantDefault =
    (values?.variant as HeroState['variant'] | undefined) ?? safeInitial.variant;

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              {/* Header row with reset button */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Homepage hero</h5>
                {/*<button*/}
                {/*  type="button"*/}
                {/*  className="btn btn-sm btn-outline-secondary"*/}
                {/*  onClick={handleResetDefaults}*/}
                {/*>*/}
                {/*  Reset to recommended*/}
                {/*</button>*/}
              </div>

              {/* key={formKey} forces uncontrolled inputs to reset from new defaults */}
              <form key={formKey} action={formAction}>
                {/* VISIBILITY */}
                <HeroVisibilityRow enabled={enabledState} onChange={setEnabledState} />

                {/* Everything below is disabled when hero is OFF */}
                <fieldset disabled={!enabledState}>
                  {/* DEVICES (show/hide per device) */}
                  <HeroDevicesRow
                    desktopShowDefault={desktopShowDefault}
                    mobileShowDefault={mobileShowDefault}
                  />

                  {/* HERO TYPE (Image vs Video per device) */}
                  <HeroTypeRow
                    desktopUseVideo={desktopUseVideo}
                    mobileUseVideo={mobileUseVideo}
                    onChangeDesktop={setDesktopUseVideo}
                    onChangeMobile={setMobileUseVideo}
                  />

                  {/* HEIGHT VARIANT – currently global, affects layout mostly on desktop */}
                  <HeroVariantRow variantDefault={variantDefault} getError={getError} />

                  {/* TEXT LAYOUT (align + chrome per device) */}
                  <HeroTextStyleRow
                    desktopAlignDefault={desktopAlignDefault}
                    desktopChromeDefault={desktopChromeDefault}
                    mobileAlignDefault={mobileAlignDefault}
                    mobileChromeDefault={mobileChromeDefault}
                  />

                  {/* CONTENT MODE (image: single/carousel, video: single/swiper) */}
                  <HeroContentModeRow
                    useVideoMode={primaryUseVideo}
                    contentMode={contentModeState}
                    onChange={setContentModeState}
                  />

                  {/* TEXT MAPPING HELP (COLLAPSIBLE) */}
                  <HeroTextMappingHelpRow
                    kickerPreview={kickerPreview}
                    headingPreview={headingPreview}
                    subheadingPreview={subheadingPreview}
                  />

                  {/* ADVANCED TOGGLES per device */}
                  <HeroFineTuningRow
                    desktopScrollCueDefault={desktopScrollCueDefault}
                    mobileScrollCueDefault={mobileScrollCueDefault}
                    desktopOverlayDefault={desktopOverlayDefault}
                    mobileOverlayDefault={mobileOverlayDefault}
                  />

                  {/* MEDIA CONFIGURATION — show if ANY device uses video */}
                  <HeroMediaSection
                    useVideoMode={desktopUseVideo || mobileUseVideo}
                    videoUrlCurrent={videoUrlCurrent}
                  />
                </fieldset>

                <FormError message={formError ?? undefined} />

                <div className="mt-3">
                  <SaveUpdateButton isEdit pending={pending} variant="primary" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
