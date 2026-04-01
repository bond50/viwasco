'use server';
import * as z from 'zod';
import { newPasswordSchema } from '@/lib/schemas/auth';
import { getPasswordResetTokenByToken } from '@/lib/data/auth/password-reset-token';
import { getUserByEmail } from '@/lib/data/auth/user';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export const newPassword = async (
  values: z.infer<typeof newPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return {
      error: 'Token missing',
    };
  }

  const validation = newPasswordSchema.safeParse(values);
  if (!validation.success) {
    return {
      error: 'invalid fields',
    };
  }

  const { password } = validation.data;
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      error: 'Invalid token',
    };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return {
      error: 'Token has expired',
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: 'Email not found',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: 'Password updated successfully' };
};
