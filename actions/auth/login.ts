// actions/login.ts
'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { loginSchema } from '@/lib/schemas/auth';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/lib/data/auth/user';
import { getTwoFactorTokenByEmail } from '@/lib/data/auth/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/lib/data/auth/two-factor-confirmation';
import { generateTwoFactorToken } from '@/lib/auth/tokens';
import { sendTwoFactorEmail } from '@/lib/auth/auth-email';
import { assertNotRateLimited2FA, assertNotRateLimitedLogin } from '@/lib/rate-limit';
import { isAllowlisted } from '@/lib/auth/authz';
import { UserRole } from '@/generated/prisma/client';

const GENERIC = 'Invalid email or password';
const DISABLE_RATE_LIMITS = true; // TODO: re-enable when done testing

export const login = async (values: z.infer<typeof loginSchema>) => {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { error: 'Invalid fields' };

  const { email, password, code } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // Rate limit
  if (!DISABLE_RATE_LIMITS) {
    try {
      await assertNotRateLimitedLogin(normalizedEmail);
    } catch {
      return { error: 'Too many attempts. Please try again in a minute.' };
    }
  }

  // Fetch user
  const user = await getUserByEmail(normalizedEmail);
  if (!user?.email || !user.password) {
    await new Promise((r) => setTimeout(r, 300)); // timing padding
    return { error: GENERIC };
  }

  // Password first (keeps timing consistent)
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 300));
    return { error: GENERIC };
  }

  // 🚧 HARD GATE: non-allowlisted credentials users never reach MFA/dashboard
  const allowedNow = (await isAllowlisted(user.email)) && user.role === UserRole.ADMIN;
  if (!allowedNow) {
    return { error: 'You can’t access this app. Please contact support.' };
  }

  // From here on, the user is permitted to proceed once the emailed code is verified.
  if (!code) {
    if (!DISABLE_RATE_LIMITS) {
      try {
        await assertNotRateLimited2FA(user.email);
      } catch {
        return {
          error: 'Too many verification codes requested. Try again shortly.',
        };
      }
    }
    const t = await generateTwoFactorToken(user.email);
    await sendTwoFactorEmail(user.email, t.token);
    return { twoFactorRequired: true };
  }

  const t = await getTwoFactorTokenByEmail(user.email);
  if (!t || t.token !== code || t.expires < new Date()) {
    return { error: 'Invalid or expired 2FA code' };
  }

  await db.twoFactorToken.delete({ where: { id: t.id } });
  const prior = await getTwoFactorConfirmationByUserId(user.id);
  if (prior) await db.twoFactorConfirmation.delete({ where: { id: prior.id } });
  await db.twoFactorConfirmation.create({ data: { userId: user.id } });

  return { success: 'Login successful!' };
};

export async function resendLoginCode(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { error: 'Email is required' };
  }

  const user = await getUserByEmail(normalizedEmail);
  if (!user?.email) {
    return { error: GENERIC };
  }

  const vt = await generateTwoFactorToken(user.email);
  await sendTwoFactorEmail(vt.email, vt.token);
  return {
    twoFactorRequired: true,
    success: 'A verification code has been sent to your registered email.',
  };
}
