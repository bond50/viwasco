import { z } from 'zod';
import { type Platform, type SocialLink, socialPlatforms } from '@/lib/schemas/shared/social';

/** Accept legacy `{ name }` or canonical `{ platform }` */
export type RawLink = Partial<SocialLink> & { name?: string | null; icon?: string | null };

/** Final normalized shape used by UI; icon is derived from `platform` elsewhere */
export type ProcessedSocialLink = { platform: Platform; url: string };

const alias: Record<string, Platform> = {
  twitter: 'x',
  x: 'x',
  fb: 'facebook',
  facebook: 'facebook',
  ig: 'instagram',
  instagram: 'instagram',
  tiktok: 'tiktok',
  linkedin: 'linkedin',
  threads: 'threads',
};

function normalizePlatform(input?: string | null): Platform | undefined {
  if (!input) return undefined;
  const key = input.toLowerCase().trim();
  if (alias[key]) return alias[key];
  return (socialPlatforms as readonly string[]).includes(key) ? (key as Platform) : undefined;
}

function normalizeUrl(u: string): string {
  return u.startsWith('http') ? u : `https://${u}`;
}

/** Loosest payload coming from Prisma JsonValue (nullable/strings allowed) */
const rawLinkInputSchema = z.object({
  platform: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  url: z.string().min(1),
  icon: z.string().optional().nullable(),
});
const rawLinksInputSchema = z.array(rawLinkInputSchema);

/** Safely coerce Prisma JsonValue → readonly RawLink[] (platform normalized to union) */
export function coerceJsonToRawLinks(input: unknown): readonly RawLink[] {
  const parse = (v: unknown) => rawLinksInputSchema.safeParse(v);

  if (typeof input === 'string') {
    try {
      const parsedJson = JSON.parse(input) as unknown;
      const res = parse(parsedJson);
      if (!res.success) return [];
      // Normalize platform here so callers get a typed `Platform | undefined`
      return res.data.map<RawLink>((l) => ({
        platform: normalizePlatform(l.platform ?? l.name),
        url: l.url,
        // keep legacy keys off the normalized output
      }));
    } catch {
      return [];
    }
  }

  const res = parse(input);
  if (!res.success) return [];
  return res.data.map<RawLink>((l) => ({
    platform: normalizePlatform(l.platform ?? l.name),
    url: l.url,
  }));
}

/**
 * Produce UI-ready links:
 * - requires a valid Platform
 * - canonicalizes/guards URL
 */
export function processSocialLinks(
  links: readonly RawLink[] | null | undefined = [],
): ProcessedSocialLink[] {
  const arr: Array<ProcessedSocialLink | null> = (links ?? [])
    .filter((l) => typeof l?.url === 'string' && l.url.trim().length > 0)
    .map((l) => {
      const platform = normalizePlatform(l.platform ?? (l as { name?: string | null }).name);
      if (!platform) return null;
      const url = normalizeUrl(l.url as string);
      return { platform, url };
    });

  return arr.filter((x): x is ProcessedSocialLink => x !== null);
}
