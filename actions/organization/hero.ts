// actions/organization/hero.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import {
  organizationHeroSchema,
  type OrganizationHeroValues,
} from '@/lib/schemas/about/organization/hero';
import type { ActionState } from '@/lib/types/action-state';
import { ORG_HERO_TAG } from '@/lib/cache/tags';
import { executeAction } from '@/lib/actions/execute-action';

const DESKTOP_DEFAULT = {
  show: true,
  useVideo: true,
  textAlign: 'left' as const,
  textChrome: 'plain' as const,
  showScrollCue: true,
  overlayStrength: 'medium' as const,
};

const MOBILE_DEFAULT = {
  show: true,
  useVideo: false,
  textAlign: 'center' as const,
  textChrome: 'plain' as const,
  showScrollCue: true,
  overlayStrength: 'soft' as const,
};

export async function updateOrganizationHero(
  orgId: string,
  _prev: ActionState<OrganizationHeroValues>,
  formData: FormData,
): Promise<ActionState<OrganizationHeroValues>> {
  if (!orgId) {
    return { success: false, errors: { _form: ['Missing organization id.'] } };
  }

  return executeAction<OrganizationHeroValues>({
    schema: organizationHeroSchema,
    formData,
    booleanFields: [
      'enabled',
      'desktopShow',
      'desktopUseVideo',
      'desktopShowScrollCue',
      'mobileShow',
      'mobileUseVideo',
      'mobileShowScrollCue',
    ],
    execute: async (data) => {
      const current = await db.organization.findUnique({
        where: { id: orgId },
        select: { metadata: true },
      });

      const meta = (current?.metadata ?? {}) as Record<string, unknown>;
      const existingHero = (meta.hero ?? {}) as Record<string, unknown>;
      const existingDesktop = (existingHero.desktop ?? {}) as Record<string, unknown>;
      const existingMobile = (existingHero.mobile ?? {}) as Record<string, unknown>;

      const bool = (input: boolean | undefined, existing: unknown, fallback: boolean): boolean => {
        if (typeof input === 'boolean') return input;
        if (typeof existing === 'boolean') return existing as boolean;
        return fallback;
      };

      const enumField = <T extends string>(
        input: T | undefined,
        existing: unknown,
        allowed: readonly T[],
        fallback: T,
      ): T => {
        const allowedStrings = allowed as readonly string[];
        if (typeof input === 'string' && allowedStrings.includes(input)) {
          return input as T;
        }
        if (typeof existing === 'string' && allowedStrings.includes(existing as string)) {
          return existing as T;
        }
        return fallback;
      };

      const desktop = {
        show: bool(data.desktopShow, existingDesktop.show, DESKTOP_DEFAULT.show),
        useVideo: bool(data.desktopUseVideo, existingDesktop.useVideo, DESKTOP_DEFAULT.useVideo),
        textAlign: enumField(
          data.desktopTextAlign,
          existingDesktop.textAlign,
          ['left', 'center'] as const,
          DESKTOP_DEFAULT.textAlign,
        ),
        textChrome: enumField(
          data.desktopTextChrome,
          existingDesktop.textChrome,
          ['plain', 'liquid', 'boxed', 'shadow'] as const,
          DESKTOP_DEFAULT.textChrome,
        ),
        showScrollCue: bool(
          data.desktopShowScrollCue,
          existingDesktop.showScrollCue,
          DESKTOP_DEFAULT.showScrollCue,
        ),
        overlayStrength: enumField(
          data.desktopOverlayStrength,
          existingDesktop.overlayStrength,
          ['none', 'soft', 'medium', 'strong'] as const,
          DESKTOP_DEFAULT.overlayStrength,
        ),
      };

      const mobile = {
        show: bool(data.mobileShow, existingMobile.show, MOBILE_DEFAULT.show),
        useVideo: bool(data.mobileUseVideo, existingMobile.useVideo, MOBILE_DEFAULT.useVideo),
        textAlign: enumField(
          data.mobileTextAlign,
          existingMobile.textAlign,
          ['left', 'center'] as const,
          MOBILE_DEFAULT.textAlign,
        ),
        textChrome: enumField(
          data.mobileTextChrome,
          existingMobile.textChrome,
          ['plain', 'liquid', 'boxed', 'shadow'] as const,
          MOBILE_DEFAULT.textChrome,
        ),
        showScrollCue: bool(
          data.mobileShowScrollCue,
          existingMobile.showScrollCue,
          MOBILE_DEFAULT.showScrollCue,
        ),
        overlayStrength: enumField(
          data.mobileOverlayStrength,
          existingMobile.overlayStrength,
          ['none', 'soft', 'medium', 'strong'] as const,
          MOBILE_DEFAULT.overlayStrength,
        ),
      };

      const nextHero: Record<string, unknown> = {
        enabled: data.enabled ?? (existingHero.enabled as boolean | undefined) ?? true,
        variant: data.variant ?? (existingHero.variant as string | undefined) ?? 'normal',
        contentMode:
          data.contentMode ?? (existingHero.contentMode as string | undefined) ?? 'single',

        videoSrc: data.videoSrc ?? (existingHero.videoSrc as string | null | undefined) ?? null,
        mobileSrc: data.mobileSrc ?? (existingHero.mobileSrc as string | null | undefined) ?? null,
        poster: data.poster ?? (existingHero.poster as string | null | undefined) ?? null,

        desktop,
        mobile,

        // text is derived from org sections now
        kicker: null,
        heading: null,
        subheading: null,
      };

      const nextMeta: Record<string, unknown> = {
        ...meta,
        hero: nextHero,
      };

      await db.organization.update({
        where: { id: orgId },
        data: { metadata: nextMeta as Prisma.InputJsonValue },
      });
    },
    revalidateTags: [ORG_HERO_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
