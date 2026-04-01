'use server';

import * as z from 'zod';
import { auth, unstable_update } from '@/auth';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/lib/data/auth/user';
import { getTwoFactorTokenByEmail } from '@/lib/data/auth/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/lib/data/auth/two-factor-confirmation';
import { generateTwoFactorToken } from '@/lib/auth/tokens';
import { sendTwoFactorEmail } from '@/lib/auth/auth-email';
import { assertNotRateLimited2FA } from '@/lib/rate-limit';

const DISABLE_RATE_LIMITS = true; // TODO: re-enable when done testing

const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

/**
 * Send a 2FA code to the currently-authenticated user's email.
 * Used by OAuth users (and as a general "resend" for credentials if needed).
 */
export async function send2faCode(): Promise<{
  success?: string;
  error?: string;
}> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!email) return { error: 'Not authenticated' };
  if (session?.mfaVerified) return { success: 'Already verified' };

  if (!DISABLE_RATE_LIMITS) {
    try {
      await assertNotRateLimited2FA(email);
    } catch {
      return {
        error: 'Too many verification codes requested. Try again shortly.',
      };
    }
  }

  const user = await getUserByEmail(email);
  if (!user) return { error: 'Not authenticated' };

  // user.email is `string | null`; prefer DB email but fall back to session email (string)
  const userEmail: string = user.email ?? email;

  const token = await generateTwoFactorToken(userEmail);
  await sendTwoFactorEmail(userEmail, token.token);

  return { success: 'Verification code sent to your email.' };
}

/**
 * Verify a submitted email 2FA code for the signed-in user.
 * On success, consumes token, sets a TwoFactorConfirmation row,
 * and flips the active session via unstable_update.
 */
export async function verify2faCode(
  input: z.infer<typeof codeSchema>,
): Promise<{ success?: string; error?: string }> {
  const parse = codeSchema.safeParse(input);
  if (!parse.success) {
    // Zod exposes `issues[]`, not `.errors`
    return { error: parse.error.issues[0]?.message ?? 'Invalid code' };
  }

  const { code } = parse.data;
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!email) return { error: 'Not authenticated' };

  const existing = await getTwoFactorTokenByEmail(email);
  if (!existing || existing.token !== code || existing.expires < new Date()) {
    return { error: 'Invalid or expired 2FA code' };
  }

  // Consume the 2FA token
  await db.twoFactorToken.delete({ where: { id: existing.id } });

  // Upsert a confirmation so jwt() callback marks mfaVerified and consumes it there too
  const user = await getUserByEmail(email);
  if (!user) return { error: 'Not authenticated' };

  const prior = await getTwoFactorConfirmationByUserId(user.id);
  if (prior) {
    await db.twoFactorConfirmation.delete({ where: { id: prior.id } });
  }
  await db.twoFactorConfirmation.create({ data: { userId: user.id } });

  // Flip the current session immediately
  await unstable_update({ mfaVerified: true });

  return { success: '2FA verified' };
}
