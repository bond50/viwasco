'use client';

import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/auth/new-verification';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import CardWrapper from '@/components/card/card-wrapper';
import { toast } from 'react-toastify';

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const onSubmit = useCallback(() => {
    if (!token) {
      setError('Token is required');
      return;
    }
    newVerification(token)
      .then((result) => {
        if (result.error) {
          setError(result.error);
          toast.error(result.error);
        } else {
          setSuccess(result.success);
          toast.success(result.success);
        }
      })
      .catch((err) => {
        console.error('Error during verification:', err);
        setError('An unexpected error occurred. Please try again later.');
      });
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSubmit();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="d-flex align-center justify-content-around w-100">
        {!success && !error && <BeatLoader />}
        {success && <FormSuccess message={success} />}
        {error && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
