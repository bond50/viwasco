import Link from 'next/link';
import { signOut } from '@/auth';
import s from './forbidden-card.module.css';

type Props = {
  email?: string | null;
  homeHref?: string; // default: "/"
  loginHref?: string; // default: "/auth/login"
  supportEmail?: string; // default: "support@example.com"
};

// Server action only used when a session exists
async function signOutToLogin() {
  'use server';
  await signOut({ redirectTo: '/auth/login' });
}

export function ForbiddenCard({
  email,
  homeHref = '/',
  loginHref = '/auth/login',
  supportEmail = 'support@example.com',
}: Props) {
  const isAuthed = Boolean(email);

  return (
    <div className={s.card} aria-labelledby="forbidden-title">
      <header className={s.header}>
        <div className={s.icon} aria-hidden>
          🚫
        </div>
        <h1 id="forbidden-title" className={s.title}>
          403 — Access forbidden
        </h1>
      </header>

      <p className={s.copy}>
        You don’t have permission to view this page.{' '}
        {isAuthed ? (
          <>
            You’re signed in as <span className={s.em}>{email}</span>.
          </>
        ) : (
          'You are not currently signed in.'
        )}
      </p>

      <div className={s.hint}>
        If you believe this is a mistake, ask an administrator to add your email to the allowlist
        and grant you the appropriate access.
      </div>

      {/* Actions differ depending on session state */}
      <div className={s.actions}>
        {isAuthed ? (
          <>
            <Link href={homeHref} className={`${s.btn} ${s.btnGhost}`}>
              Home
            </Link>

            {/* Switch account → sign out then go to login */}
            <form action={signOutToLogin}>
              <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>
                Switch account
              </button>
            </form>

            {/* Plain sign out to login (same result, keeps layout 3-up) */}
            <form action={signOutToLogin}>
              <button type="submit" className={`${s.btn} ${s.btnDanger}`}>
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href={homeHref} className={`${s.btn} ${s.btnGhost}`}>
              Home
            </Link>
            <Link href={loginHref} className={`${s.btn} ${s.btnPrimary}`}>
              Go to login
            </Link>
            <a href={`mailto:${supportEmail}`} className={`${s.btn} ${s.btnGhost}`}>
              Contact support
            </a>
          </>
        )}
      </div>

      {!isAuthed && (
        <p className={s.support}>
          Need help? <a href={`mailto:${supportEmail}`}>Contact support</a>
        </p>
      )}
    </div>
  );
}
