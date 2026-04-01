'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register } from '@/actions/auth/register';
import { useState, useTransition } from 'react';
import CardWrapper from '@/components/card/card-wrapper';
import InputField from '@/components/form-elements/input-field';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/form-elements/button';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { registerSchema } from '@/lib/schemas/auth';

export function RegisterForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setSuccess('');
    setError('');
    startTransition(() => {
      register(values).then((data) => {
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        }
        setSuccess(data.success);
        toast.success(data.success);
        form.reset();
      });
    });
  }

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          <InputField
            name="name"
            control={form.control}
            label="Your name"
            type="text"
            disabled={isPending}
          />
        </div>
        <div className="mb-4">
          <InputField
            name="email"
            control={form.control}
            label="Email"
            type="email"
            disabled={isPending}
          />
        </div>
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
            'Create account'
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}
