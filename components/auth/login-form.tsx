'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { login, resendLoginCode } from '@/actions/auth/login';
import CardWrapper from '@/components/card/card-wrapper';
import { Button } from '@/components/form-elements/button';
import InputField from '@/components/form-elements/input-field';
import { ForgotPasswordLink } from '@/components/auth/forgot-password-link';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { loginSchema } from '@/lib/schemas/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { Otp6 } from '@/components/auth/two-fa/Otp6';
import { ResendControls } from '@/components/auth/two-fa/ResendControls';
import { CODE_LENGTH, COOLDOWN_SEC } from '@/components/auth/two-fa/constants';
import { markSent, remainingCooldownSec } from '@/components/auth/two-fa/storage';
import { useCooldown } from '@/hooks/useCooldown';
import { useHydrated } from '@/hooks/useHydrated';

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL ?? '';

function resolveLoginRedirect(target?: string | null) {
  const base = CLIENT_URL || window.location.origin;
  const fallback = new URL(DEFAULT_LOGIN_REDIRECT, base);

  if (!target) return fallback.toString();

  try {
    const url = new URL(target, base);
    const path = `${url.pathname}${url.search}${url.hash}`;
    return new URL(path, base).toString();
  } catch {
    return fallback.toString();
  }
}

type RedirectLike = { digest: string };
function hasDigest(e: unknown): e is RedirectLike {
  return (
    typeof e === 'object' &&
    e !== null &&
    'digest' in e &&
    typeof (e as { digest: unknown }).digest === 'string' // ← check unknown, not asserted string
  );
}

function isNextRedirectError(err: unknown): err is RedirectLike {
  if (hasDigest(err) && (err.digest === 'REDIRECT' || err.digest.startsWith('NEXT_REDIRECT'))) {
    return true;
  }

  return (
    err instanceof Error && /unexpected response was received from the server/i.test(err.message)
  );
}

export function LoginForm() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const hydrated = useHydrated();
  const [isVerifying, startVerify] = useTransition();
  const [isResending, startResend] = useTransition();
  const { cooldown, start: startCooldown } = useCooldown(
    typeof window === 'undefined' ? 0 : remainingCooldownSec(),
    hydrated,
  );

  const err = searchParams.get('error');
  const urlError =
    err === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider'
      : err === 'NotAuthorized'
        ? 'You can’t access this app. Please contact support.'
        : '';

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', code: '' },
  });
  const codeValue = useWatch({ control: form.control, name: 'code' }) ?? '';

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setSuccess('');
    setError('');

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset({ email: values.email, password: '', code: '' });
            setError(data.error);
            toast.error(data.error);
            return;
          }

          if (data?.twoFactorRequired) {
            setShowTwoFactor(true);
            setSuccess('A verification code has been sent to your registered email.');
            toast.success('Check your email for the verification code.');
            markSent();
            startCooldown(COOLDOWN_SEC);
            return;
          }

          if (data?.success) {
            void (async () => {
              const result = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
                code: values.code ?? '',
                redirectTo: DEFAULT_LOGIN_REDIRECT,
              });

              if (result?.error) {
                setError('Unexpected error occurred. Please try again later.');
                toast.error('Unexpected error occurred. Please try again later.');
                return;
              }

              setSuccess(data.success);
              toast.success(data.success);
              window.location.replace(resolveLoginRedirect(result?.url));
            })().catch((err) => {
              console.error('Login sign-in error:', err);
              setError('Unexpected error occurred. Please try again later.');
            });
          }
        })
        .catch((err) => {
          // ⛔️ IMPORTANT: rethrow redirect so Next navigates (e.g. to /forbidden)
          if (isNextRedirectError(err)) {
            throw err;
          }
          console.error('Login error:', err);
          setError('Unexpected error occurred. Please try again later.');
        });
    });
  }

  const resendCode = () => {
    if (!hydrated || cooldown > 0 || isResending) return;

    setError('');
    setSuccess('');
    form.setValue('code', '', { shouldValidate: true });

    startResend(async () => {
      const email = form.getValues('email');
      const res = await resendLoginCode(email);
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
        return;
      }

      if (res?.twoFactorRequired) {
        setSuccess('A verification code has been sent to your registered email.');
        toast.success('Check your email for the verification code.');
        markSent();
        startCooldown(COOLDOWN_SEC);
        return;
      }

      if (res?.success) {
        setSuccess(res.success);
        toast.success(res.success);
      }
    });
  };

  const verifyCode = (code: string) => {
    if (!hydrated || isVerifying) return;
    const normalized = code.replace(/\D/g, '');
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(normalized)) return;

    setError('');
    setSuccess('');

    startVerify(async () => {
      const result = await login({
        email: form.getValues('email'),
        password: form.getValues('password'),
        code: normalized,
      });

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      const msg = '2FA verified';
      setSuccess(msg);
      toast.success(msg);

      const authResult = await signIn('credentials', {
        redirect: false,
        email: form.getValues('email'),
        password: form.getValues('password'),
        code: normalized,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });

      if (authResult?.error) {
        setError('Unexpected error occurred. Please try again later.');
        toast.error('Unexpected error occurred. Please try again later.');
        return;
      }

      window.location.replace(resolveLoginRedirect(authResult?.url));
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          {showTwoFactor ? (
            <>
              <div className="mb-3">
                <label htmlFor="code-0" className="form-label">
                  Verification code
                </label>
                <Otp6
                  value={codeValue}
                  onChangeAction={(value) => form.setValue('code', value, { shouldValidate: true })}
                  onCompleteAction={(value) => {
                    form.setValue('code', value, { shouldValidate: true });
                    verifyCode(value);
                  }}
                  disabled={isPending}
                />
              </div>
              <ResendControls
                hydrated={hydrated}
                cooldown={cooldown}
                isResending={isResending}
                onResendAction={resendCode}
              />
            </>
          ) : (
            <>
              <div className="mb-4">
                <InputField
                  name="email"
                  control={form.control}
                  label="Email"
                  type="email"
                  placeholder="doe@example.com"
                  disabled={isPending}
                />
              </div>
              <div className="mb-4">
                <InputField
                  name="password"
                  control={form.control}
                  label="Password"
                  type="password"
                  placeholder="********"
                  disabled={isPending}
                />
              </div>
              <ForgotPasswordLink label="Forgot password?" align="right" />
            </>
          )}
        </div>

        <FormError message={error || urlError} />
        <FormSuccess message={success} />

        <Button type="submit" disabled={isPending} fullWidth variant="primary">
          {isPending ? (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <ClipLoader size={16} color="#fff" />{' '}
              {showTwoFactor ? 'Submitting...' : 'Logging in...'}
            </div>
          ) : showTwoFactor ? (
            'Submit Code'
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}
