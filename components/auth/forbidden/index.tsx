// components/auth/forbidden/ForbiddenScreen.tsx
import { auth } from '@/auth';
import s from './forbidden-screen.module.css';
import { ForbiddenCard } from '@/components/auth/forbidden/forbidden-card';

export async function ForbiddenScreen() {
  const session = await auth();
  const email = session?.user?.email ?? null;

  return (
    <main className={s.shell}>
      <div className={s.wrap}>
        <ForbiddenCard
          email={email}
          homeHref="/"
          loginHref="/auth/login"
          supportEmail="support@example.com"
        />
      </div>
    </main>
  );
}
