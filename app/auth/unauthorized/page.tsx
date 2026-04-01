import { auth } from '@/auth';
import { UnauthorizedCard } from '@/components/auth/unauthorized/UnauthorizedCard';

export const metadata = {
  title: 'Unauthorized',
  description: 'You are not allowed to access this application.',
};

export default async function UnauthorizedPage() {
  const session = await auth();
  const email = session?.user?.email ?? null;

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <UnauthorizedCard email={email} />
      </div>
    </main>
  );
}
