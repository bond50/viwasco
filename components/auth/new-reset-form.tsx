'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';
import { newPasswordSchema } from '@/lib/schemas/auth';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { newPassword } from '@/actions/auth/new-password';
import CardWrapper from '@/components/card/card-wrapper';
import InputField from '@/components/form-elements/input-field';
import { Button } from '@/components/form-elements/button';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

export function NewResetForm() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof newPasswordSchema>) {
    setSuccess('');
    setError('');

    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data?.error) {
          setError(data.error);
          toast.error(data.error);
          return;
        }

        if (data?.success) {
          setSuccess(data.success);
          toast.success(data.success);
          form.reset();

          setTimeout(() => {
            router.push('/auth/login');
          }, 1500);
        }
      });
    });
  }

  return (
    <CardWrapper
      headerLabel={'Enter your new password'}
      backButtonLabel={'Back to login'}
      backButtonHref={'/auth/login'}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          <InputField
            name="password"
            control={form.control}
            label="Password"
            type="password"
            disabled={isPending}
          />
        </div>
        <div className="mb-4">
          <InputField
            name="confirmPassword"
            control={form.control}
            label="Confirm Password"
            type="password"
            disabled={isPending}
          />
        </div>

        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}

        <Button type="submit" disabled={isPending} fullWidth variant="primary">
          {isPending ? (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <ClipLoader color="#fff" size={16} /> Creating...
            </div>
          ) : (
            'Set new password'
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}
