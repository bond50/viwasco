import Link from 'next/link';
import s from './unauthorized-card.module.css';

type Props = {
  email?: string | null;
  homeHref?: string;
  loginHref?: string;
  supportEmail?: string;
};

export function UnauthorizedCard({
  email,
  homeHref = '/',
  loginHref = '/auth/login',
  supportEmail = 'support@example.com',
}: Props) {
  return (
    <section className={s.card} aria-labelledby="unauth-title">
      <header className={s.header}>
        <div className={s.icon} aria-hidden>
          🔒
        </div>
        <h1 id="unauth-title" className={s.title}>
          Unauthorized
        </h1>
      </header>

      <p className={s.copy}>
        You don’t have access to this application.
        {email ? (
          <>
            {' '}
            You tried to sign in as <span className={s.em}>{email}</span>.
          </>
        ) : null}
      </p>

      <div className={s.hint}>
        If you believe this is a mistake, ask an administrator to allow your email address.
      </div>

      <div className={s.actions}>
        <Link href={homeHref} className={`${s.btn} ${s.btnGhost}`}>
          Home
        </Link>
        <Link href={loginHref} className={`${s.btn} ${s.btnPrimary}`}>
          Go to login
        </Link>
      </div>

      <p className={s.support}>
        Need help? <a href={`mailto:${supportEmail}`}>Contact support</a>
      </p>
    </section>
  );
}
