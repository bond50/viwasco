'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

/** Go back to login. If the user is authenticated, sign out; otherwise just navigate. */
export function useLogoutToLogin() {
  const router = useRouter();

  return async () => {
    try {
      // Auth.js v5: use redirectTo (callbackUrl is deprecated)
      await signOut({ redirect: true, redirectTo: '/auth/login' });
    } catch {
      // Fallback without touching window.location
      router.replace('/auth/login');
    }
  };
}
