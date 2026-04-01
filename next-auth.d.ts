// src/types/next-auth.d.ts
import { type DefaultSession } from 'next-auth';
import { type UserRole } from '@/generated/prisma/client';

/**
 * Augment NextAuth Session with our custom flags and user fields.
 * Keep this in sync with what you assign in callbacks.session().
 */
declare module 'next-auth' {
  interface Session {
    /** Admin app always requires MFA; we expose both flags on Session for easy checks */
    mfaRequired: boolean;
    mfaVerified: boolean;
    user: {
      /** Prisma User.id */
      id: string;
      /** Prisma enum */
      role: UserRole;
      /** Whether user has any 2FA mechanism enabled (email for now; TOTP/WebAuthn later) */
      isTwoFAEnabled: boolean;
      /** Whether user has any OAuth account linked (Google/GitHub) */
      isOAuth: boolean;
      /** User avatar; we normalize from JWT.picture / JWT.image */
      image?: string | null;
    } & DefaultSession['user'];
  }
}

/**
 * Augment NextAuth JWT with our claims.
 * Keep this in sync with what you assign in callbacks.jwt().
 */
declare module 'next-auth/jwt' {
  interface JWT {
    /** Standard fields NextAuth may set */
    sub?: string;
    name?: string | null;
    email?: string | null;

    /** Preferred image field per NextAuth; we also keep image for legacy compatibility */
    picture?: string | null;
    image?: string | null;

    /** Authorization */
    role?: UserRole;

    /** Factors/flags carried on the token */
    isTwoFAEnabled?: boolean;
    isOAuth?: boolean;
    mfaRequired?: boolean;
    mfaVerified?: boolean;
  }
}

/**
 * Handy helper type for places where you need a fully-typed session.user.
 */
export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  isTwoFAEnabled: boolean;
  isOAuth: boolean;
};
