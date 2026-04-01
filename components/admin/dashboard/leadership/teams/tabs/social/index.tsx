// components/admin/dashboard/leadership/teams/tabs/social.tsx
'use client';

import { useFormAction } from '@/hooks/use-form-action';
import { SocialLinksInput } from '@/components/form-elements/social-link-input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import type { Platform, SocialLink } from '@/lib/schemas/shared/social';
import type { TeamSettingsData } from '@/lib/types/about/leadership';
import type { ManagementTeamSocialValues } from '@/lib/schemas/about/content/leadership';
import { updateTeamMemberSocial } from '@/actions/about/content/leadership';

// no any
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

const isCanonicalLink = (v: unknown): v is SocialLink =>
  isObject(v) && typeof v.platform === 'string' && typeof v.url === 'string';

type LegacySocialLink = {
  name: string;
  url: string;
  icon?: string | null;
};

const isLegacyLink = (v: unknown): v is LegacySocialLink =>
  isObject(v) && typeof v.name === 'string' && typeof v.url === 'string';

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

const ensureHttp = (u: string): string => (u.startsWith('http') ? u : `https://${u}`);

const guessPlatformFromUrl = (url: string): Platform | null => {
  try {
    const host = new URL(ensureHttp(url)).hostname.toLowerCase();
    for (const key of Object.keys(aliasToPlatform)) {
      if (host.includes(key)) return aliasToPlatform[key as keyof typeof aliasToPlatform];
    }
  } catch {
    // ignore
  }
  return null;
};

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

type Props = { team: TeamSettingsData };

export function TeamSocialTab({ team }: Props) {
  const { formAction, pending, state, formError } = useFormAction<ManagementTeamSocialValues>(
    updateTeamMemberSocial.bind(null, team.id),
    {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    },
  );

  const rawLinks: unknown = state?.values?.socialLinks ?? team.social.socialLinks ?? null;
  const defLinks = normalizeSocialLinks(rawLinks);

  return (
    <form action={formAction}>
      <div className="mb-3">
        <SocialLinksInput errors={state?.errors} defaultLinks={defLinks} />
      </div>

      <FormError message={formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
