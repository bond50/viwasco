import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserByEmail } from '@/lib/data/auth/user';
import bcrypt from 'bcryptjs';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { loginSchema } from '@/lib/schemas/auth';

export default {
  providers: [
    GitHub,
    Google({
      authorization: { params: { prompt: 'select_account' } },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
