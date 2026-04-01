// components/auth/two-fa/TwoFAClient.tsx
'use client';

import React, { Suspense } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import CardWrapper from '@/components/card/card-wrapper';
import { useLogoutToLogin } from '@/hooks/useLogoutToLogin';
import { TwoFAForm } from './TwoFAForm';

export function TwoFA() {
  const logoutToLogin = useLogoutToLogin();

  return (
    <CardWrapper
      headerLabel="Two-Factor Authentication"
      backButtonLabel="Back to login"
      onBackClick={logoutToLogin}
      showSocial={false}
    >
      <Suspense
        fallback={
          <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
            <ClipLoader size={16} /> Loading…
          </div>
        }
      >
        <TwoFAForm />
      </Suspense>
    </CardWrapper>
  );
}
