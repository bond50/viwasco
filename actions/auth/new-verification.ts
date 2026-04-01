'use server';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/lib/data/auth/user';
import { getVerificationTokenByToken } from '@/lib/data/auth/verification-token';

export const newVerification = async (token: string) => {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) {
    return { error: 'Token does not exist!' };
  }
  if (verificationToken.expires < new Date()) {
    return { error: 'Token has expired!' };
  }

  const user = await getUserByEmail(verificationToken.email);

  if (!user) {
    return { error: 'User not found!' };
  }

  // Update user's verified status
  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      email: verificationToken.email,
    },
  });

  // Delete the verification token after successful verification
  await db.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return { success: 'User successfully verified!' };
};
