import { nanoid } from 'nanoid';
import { getVerificationTokenByEmail } from '@/lib/data/auth/verification-token';
import { db } from '@/lib/db';
import { getPasswordResetTokenByEmail } from '@/lib/data/auth/password-reset-token';
import * as crypto from 'crypto';
import { getTwoFactorTokenByEmail } from '@/lib/data/auth/two-factor-token';

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 999_999).toString().padStart(6, '0'); // 6-digit token
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  return db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

export const generatePasswordResetToken = async (email: string) => {
  const token = nanoid(32);
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  return db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};
export const generateVerificationToken = async (email: string) => {
  const token = nanoid(32);
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 min from now

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  return db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};
