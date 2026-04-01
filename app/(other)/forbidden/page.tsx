import { Suspense } from 'react';

import { auth } from '@/auth';
import { ForbiddenCard } from '@/components/auth/forbidden/forbidden-card';

export const metadata = {
  title: 'Access Forbidden — 403',
  description: "You don't have permission to access this page.",
};

function ForbiddenShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-light">
      <div className="container min-vh-100 d-flex align-items-center">
        <div className="w-100 mx-auto" style={{ maxWidth: 600 }}>
          {children}
        </div>
      </div>
    </main>
  );
}

async function ForbiddenCardContent() {
  const session = await auth();
  const email = session?.user?.email ?? null;

  return (
    <ForbiddenCard
      email={email}
      homeHref="/"
      loginHref="/auth/login"
      supportEmail="support@example.com"
    />
  );
}

export default function ForbiddenPage() {
  return (
    <ForbiddenShell>
      <Suspense
        fallback={
          <ForbiddenCard
            email={null}
            homeHref="/"
            loginHref="/auth/login"
            supportEmail="support@example.com"
          />
        }
      >
        <ForbiddenCardContent />
      </Suspense>
    </ForbiddenShell>
  );
}
