// actions/register.ts
'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/lib/data/auth/user';
import { registerSchema } from '@/lib/schemas/auth';
import { canBootstrap, isAllowlisted } from '@/lib/auth/authz';
import { UserRole } from '@/generated/prisma/client';
import { generateVerificationToken } from '@/lib/auth/tokens';
import { sendVerificationEmail } from '@/lib/auth/auth-email';

export const register = async (values: z.infer<typeof registerSchema>) => {
  // 0) Validate
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) return { error: 'Invalid fields!' };

  const { email, password, name } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // 1) Already taken?
  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    return { error: 'Email already taken!' };
  }

  // 2) Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3) Policy flags (DB-first with env fallback)  ← CHANGED: now awaited
  const allowlisted = await isAllowlisted(normalizedEmail); // ← CHANGED
  const bootstrap = await canBootstrap(); // ← CHANGED

  // 4) Create user
  //    If allowlisted+bootstrap, they get ADMIN role immediately,
  //    but we still require email verification (do NOT set emailVerified).
  const role: UserRole = allowlisted && bootstrap ? UserRole.ADMIN : UserRole.USER;

  await db.user.create({
    data: {
      email: normalizedEmail,
      name,
      password: hashedPassword,
      role,
      // NOTE: do NOT set emailVerified here — we will send a verification email instead
    },
  });

  // 5) Post-create flow
  if (!allowlisted) {
    // Quiet registration: do NOT send a verification email
    return {
      success: 'Thanks! Your registration was received. An administrator will review your account.',
    };
  }

  // Allowlisted (both bootstrap true/false): send verification email
  const vt = await generateVerificationToken(normalizedEmail);
  await sendVerificationEmail(vt.email, vt.token);

  // Tailor the success messages slightly for admins
  if (bootstrap) {
    return {
      success: 'Check your email to verify your account before the link expires.',
    };
  }

  return {
    success: 'Check your email to verify your account before the link expires.',
  };
};
