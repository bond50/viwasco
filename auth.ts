// auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/auth.config';
import { db } from '@/lib/db';
import { getUserById } from '@/lib/data/auth/user';
import { getTwoFactorConfirmationByUserId } from '@/lib/data/auth/two-factor-confirmation';
import { getAccountByUserId } from '@/lib/data/auth/account';
import { UserRole } from '@/generated/prisma/client';
import { canBootstrap, isAllowlisted } from '@/lib/auth/authz';
import { forbiddenRoute, unauthorizedRoute } from '@/routes';

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  adapter: PrismaAdapter(db),

  pages: { signIn: '/auth/login', error: '/auth/error' },

  events: {
    /**
     * Only auto-verify a newly linked OAuth account if:
     *   - user is already ADMIN, or
     *   - bootstrap is ON and email is allowlisted
     *
     * Otherwise do NOT verify. This lets OAuth create a session but not “bless”
     * the account unless your env allows it.
     */
    async linkAccount({ user }) {
      const email = (user?.email ?? '').toLowerCase();
      const u = await db.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });

      if (u?.role === UserRole.ADMIN || ((await canBootstrap()) && (await isAllowlisted(email)))) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },

    /**
     * On first OAuth sign-in, only promote to ADMIN when bootstrap + allowlisted.
     * Otherwise, user row is created as a normal USER (unverified unless linkAccount above ran).
     */
    async createUser({ user }) {
      const email = (user?.email ?? '').toLowerCase();
      if (!email) return;

      if ((await canBootstrap()) && (await isAllowlisted(email))) {
        await db.user.update({
          where: { id: user.id },
          data: { role: UserRole.ADMIN, emailVerified: new Date() },
        });
      }
    },
  },

  callbacks: {
    /**
     * Sign-in policy:
     * - CREDENTIALS:
     *   Non-ADMIN are blocked (your server action already hard-gates before calling signIn,
     *   but this keeps it consistent). Send them to /auth/unauthorized.
     *
     * - OAUTH:
     *   Always return true to create a session (regardless of allowlist), but do NOT
     *   verify or promote unless bootstrap + allowlisted. Protected pages still require ADMIN
     *   (middleware enforces that), so non-admin OAuth sessions can’t access /dashboard, etc.
     */
    async signIn({ user, account }) {
      const email = (user?.email ?? '').toLowerCase();
      const provider = account?.provider ?? 'unknown';

      if (!email) {
        return provider === 'credentials' ? unauthorizedRoute : forbiddenRoute;
      }

      const existing = await db.user.findUnique({
        where: { email },
        select: { id: true, role: true, emailVerified: true },
      });

      const allowlisted = await isAllowlisted(email);
      const bootstrap = await canBootstrap();

      if (existing) {
        if (existing.role !== UserRole.ADMIN) {
          if (provider === 'credentials') {
            // Credentials stay strict — your action already blocks, this is defense-in-depth.
            return unauthorizedRoute;
          }

          // OAuth: allow session creation but do NOT escalate unless bootstrap+allowlisted
          if (bootstrap && allowlisted) {
            await db.user.update({
              where: { id: existing.id },
              data: {
                role: UserRole.ADMIN,
                emailVerified: existing.emailVerified ?? new Date(),
              },
            });
          }
          return true; // session allowed for OAuth (role remains USER unless escalated above)
        }

        // Already ADMIN
        return true;
      }

      // No user row yet
      if (provider !== 'credentials') {
        // OAuth first-time: allow session creation (user will be created by the adapter).
        // Only bootstrap+allowlisted users get promoted (handled in events.createUser).
        return true;
      }

      // First-time credentials sign-in is never allowed here
      return unauthorizedRoute;
    },

    async jwt({ token, trigger, session }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);
      if (!dbUser) return token;

      // Race-guard: if bootstrap + allowlisted, ensure ADMIN now (idempotent)
      if (
        (await canBootstrap()) &&
        typeof token.email === 'string' &&
        (await isAllowlisted(token.email)) &&
        dbUser.role !== UserRole.ADMIN
      ) {
        await db.user.update({
          where: { id: dbUser.id },
          data: {
            role: UserRole.ADMIN,
            emailVerified: dbUser.emailVerified ?? new Date(),
          },
        });
        dbUser.role = UserRole.ADMIN;
      }

      const existingAccount = await getAccountByUserId(dbUser.id);

      if (typeof dbUser.image === 'string') {
        token.picture = dbUser.image;
        token.image = dbUser.image;
      }

      token.isOAuth = !!existingAccount;
      token.role = dbUser.role;

      const hasTwoFactor = dbUser.isTwoFAEnabled ?? false;
      token.mfaRequired = hasTwoFactor;
      token.isTwoFAEnabled = hasTwoFactor;

      if (!hasTwoFactor) {
        token.mfaVerified = true;
      }

      const confirm = await getTwoFactorConfirmationByUserId(dbUser.id);
      if (confirm) {
        token.mfaVerified = true;
        await db.twoFactorConfirmation.delete({ where: { id: confirm.id } });
      }

      if (trigger === 'update' && session?.mfaVerified === true) {
        token.mfaVerified = true;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.mfaRequired = Boolean(token.mfaRequired);
        session.mfaVerified = Boolean(token.mfaVerified);

        session.user.id = token.sub ?? '';
        session.user.role = (token.role as UserRole) ?? UserRole.USER;
        session.user.isTwoFAEnabled = Boolean(token.isTwoFAEnabled);
        session.user.isOAuth = Boolean(token.isOAuth);

        if (typeof token.name === 'string') session.user.name = token.name;
        if (typeof token.email === 'string') session.user.email = token.email;

        if (typeof token.picture === 'string') {
          session.user.image = token.picture;
        } else if (typeof token.image === 'string') {
          session.user.image = token.image;
        } else {
          session.user.image = session.user.image ?? '';
        }
      }
      return session;
    },

    redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        const u = new URL(url);
        return u.origin === baseUrl ? url : baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },

  session: { strategy: 'jwt' },

  ...authConfig,
});
