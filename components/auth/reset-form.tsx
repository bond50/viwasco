'use client';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { resetSchema } from '@/lib/schemas/auth';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { reset } from '@/actions/auth/reset';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import CardWrapper from '@/components/card/card-wrapper';
import InputField from '@/components/form-elements/input-field';
import { Button } from '@/components/form-elements/button';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

export function ResetForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof resetSchema>) {
    setSuccess('');
    setError('');
    startTransition(() => {
      console.log('Submitting login new with core-values:', values);
      reset(values).then((data) => {
        if (data?.error) {
          setError(data.error);
          toast.error(data.error);
          return;
        }
        setSuccess(data.success);
        toast.success(data.success);
        form.reset();
      });
    });
  }

  return (
    <CardWrapper
      headerLabel={'Forgot Password?'}
      backButtonLabel={'Back to login'}
      backButtonHref={'/auth/login'}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          <InputField
            name="email"
            control={form.control}
            label="Email"
            type="email"
            disabled={isPending}
          />
        </div>

        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}

        <Button type="submit" disabled={isPending} fullWidth variant="primary">
          {isPending ? (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <ClipLoader color="#fff" size={16} /> Sending...
            </div>
          ) : (
            'Send reset email'
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}
