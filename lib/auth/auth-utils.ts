// lib/auth-utils.ts
import { auth } from '@/auth';
import { ExtendedUser } from '@/next-auth';

/**
 * Gets the current user as a fully-normalized ExtendedUser.
 * - Ensures name/email/image are never undefined (use null instead)
 * - Returns null if not signed in
 */
export async function getCurrentUser(): Promise<ExtendedUser | null> {
  const session = await auth();
  const u = session?.user;
  if (!u) return null;

  return {
    id: u.id,
    name: u.name ?? null,
    email: u.email ?? null,
    image: (typeof u.image === 'string' ? u.image : null) ?? null,
    role: u.role,
    isTwoFAEnabled: u.isTwoFAEnabled,
    isOAuth: u.isOAuth,
  };
}

/**
 * Requires a signed-in user and returns a normalized ExtendedUser.
 * - Throws if unauthenticated (your server actions catch and render an error)
 */
export async function requireCurrentUser(): Promise<ExtendedUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
