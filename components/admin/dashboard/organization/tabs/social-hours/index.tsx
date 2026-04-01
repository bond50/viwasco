'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { SocialLinksInput } from '@/components/form-elements/social-link-input';
import { WorkingHoursInput } from '@/components/form-elements/working-hours-input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { updateOrganizationSocialHours } from '@/actions/organization';
import { SocialHoursState } from '@/lib/types/about';
import { OrganisationSocialHoursValues } from '@/lib/schemas/about/organization/social-hours';

import type { Platform, SocialLink } from '@/lib/schemas/shared/social';

type Props = { orgId: string; initial: SocialHoursState };

// Legacy shape (older data/UI)
type LegacySocialLink = {
  name: string;
  url: string;
  icon?: string | null;
};

// Aliases → canonical Platform
const aliasToPlatform: Record<string, Platform> = {
  facebook: 'facebook',
  fb: 'facebook',
  'facebook.com': 'facebook',

  x: 'x',
  twitter: 'x',
  'twitter.com': 'x',

  instagram: 'instagram',
  ig: 'instagram',
  'instagram.com': 'instagram',

  tiktok: 'tiktok',
  'tiktok.com': 'tiktok',

  linkedin: 'linkedin',
  li: 'linkedin',
  'linkedin.com': 'linkedin',

  threads: 'threads',
  'threads.net': 'threads',
};

// Type guards (no any)
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

const isCanonicalLink = (v: unknown): v is SocialLink =>
  isObject(v) && typeof v.platform === 'string' && typeof v.url === 'string';

const isLegacyLink = (v: unknown): v is LegacySocialLink =>
  isObject(v) && typeof v.name === 'string' && typeof v.url === 'string';

const ensureHttp = (u: string): string => (u.startsWith('http') ? u : `https://${u}`);

const guessPlatformFromUrl = (url: string): Platform | null => {
  try {
    const host = new URL(ensureHttp(url)).hostname.toLowerCase();
    for (const key of Object.keys(aliasToPlatform)) {
      if (host.includes(key)) return aliasToPlatform[key as keyof typeof aliasToPlatform];
    }
  } catch {
    // ignore; URL validity is handled by your zod schema elsewhere
  }
  return null;
};

// Strict normalizer: unknown → SocialLink[] | undefined
function normalizeSocialLinks(input: unknown): SocialLink[] | undefined {
  if (!Array.isArray(input)) return undefined;

  const out: SocialLink[] = [];
  for (const item of input) {
    if (isCanonicalLink(item)) {
      out.push({ platform: item.platform, url: item.url });
      continue;
    }
    if (isLegacyLink(item)) {
      const key = item.name.toLowerCase().replace(/\s+/g, '');
      const platform = aliasToPlatform[key] ?? guessPlatformFromUrl(item.url);
      if (platform) out.push({ platform, url: item.url });
    }
  }
  return out.length ? out : undefined;
}

export function SocialHoursTab({ orgId, initial }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrganisationSocialHoursValues>(updateOrganizationSocialHours.bind(null, orgId), {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    });
  const formKey = useRemountOnRefresh(state?.success, initial);

  const rawLinks: unknown = state?.values?.socialLinks ?? initial.socialLinks;
  const defLinks = normalizeSocialLinks(rawLinks);

  const defHours = state?.values?.workingHours ?? initial.workingHours ?? null;

  return (
    <form key={formKey} action={formAction}>
      <div className="mb-3">
        <SocialLinksInput errors={state?.errors} defaultLinks={defLinks} />
      </div>

      <div className="mb-3">
        <WorkingHoursInput
          name="workingHours"
          defaultValue={defHours}
          error={getError('workingHours')}
        />
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
