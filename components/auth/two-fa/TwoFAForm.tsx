'use client';

import React, { FormEvent, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';

import { send2faCode, verify2faCode } from '@/actions/auth/mfa';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/form-elements/button';

import { useHydrated } from '@/hooks/useHydrated';
import { useCooldown } from '@/hooks/useCooldown';
import { CODE_LENGTH, COOLDOWN_SEC } from './constants';
import { clearSent, markSent, remainingCooldownSec } from './storage';
import { Otp6 } from './Otp6';
import { ResendControls } from './ResendControls';
import styles from './two-fa.module.css';

// tiny dedupe guard for the success toast in case of rapid double-mounts
function toastOnce(msg: string) {
  const KEY = 'mfa-toast-lock-v1';
  const now = Date.now();
  try {
    const last = Number(sessionStorage.getItem(KEY) || '0');
    if (now - last < 2000) return; // ignore dupes within 2s
    sessionStorage.setItem(KEY, String(now));
  } catch {}
  toast.success(msg);
}

// detect hard reloads so we can skip auto-send on refresh if desired
function isHardReload(): boolean {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    return nav?.type === 'reload';
  } catch {
    return false;
  }
}

export function TwoFAForm() {
  const router = useRouter();
  const qs = useSearchParams();
  const hydrated = useHydrated();

  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [success, setSuccess] = React.useState<string | undefined>();

  const [isVerifying, startVerify] = useTransition();
  const [isResending, startResend] = useTransition();

  // SSR-stable initial cooldown; client reads from storage immediately
  const { cooldown, start: startCooldown } = useCooldown(
    typeof window === 'undefined' ? 0 : remainingCooldownSec(),
    hydrated,
  );

  // StrictMode-safe single-run guard
  const startedRef = useRef(false);

  // Auto-send on first visit after login (not on hard reload)
  useEffect(() => {
    if (!hydrated) return;
    if (startedRef.current) return; // block React StrictMode double-invoke
    if (isHardReload()) return; // optional: don't auto-send on manual refresh

    startedRef.current = true;

    // Clear any stale flags from older visits so login→2FA always sends
    clearSent();

    startResend(async () => {
      const res = await send2faCode();
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
        startedRef.current = false; // allow another attempt if the first failed
      } else {
        const msg = res?.success || 'Verification code sent';
        setSuccess(msg);
        toastOnce(msg);
        markSent(); // start cooldown from now
        startCooldown(COOLDOWN_SEC);
      }
    });
  }, [hydrated, startResend, startCooldown]);

  const verifyAndRedirect = (normalized: string) => {
    setError(undefined);
    setSuccess(undefined);

    startVerify(async () => {
      const res = await verify2faCode({ code: normalized });
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      clearSent();
      const next = qs.get('next');
      const dest = next && next.startsWith('/') ? next : '/dashboard';
      toast.success('2FA verified');
      router.replace(dest);
    });
  };

  const onAutoComplete = (raw: string) => {
    if (!hydrated || isVerifying) return;
    const normalized = raw.replace(/\D/g, '');
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(normalized)) return;
    verifyAndRedirect(normalized);
  };

  const onResend = () => {
    if (!hydrated || cooldown > 0 || isResending) return;
    setError(undefined);
    setSuccess(undefined);

    startResend(async () => {
      const res = await send2faCode();
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        const msg = res?.success || 'Verification code sent';
        setSuccess(msg);
        toastOnce(msg);
        markSent();
        startCooldown(COOLDOWN_SEC);
      }
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const normalized = code.replace(/\D/g, '');
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(normalized)) {
      setError(`Enter the ${CODE_LENGTH}-digit code`);
      return;
    }
    verifyAndRedirect(normalized);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label htmlFor="code-0" className="form-label">
          Verification code
        </label>

        <div className="mb-3">
          <Otp6
            value={code}
            onChangeAction={setCode}
            onCompleteAction={onAutoComplete}
            disabled={isVerifying}
          />
        </div>

        <ResendControls
          hydrated={hydrated}
          cooldown={cooldown}
          isResending={isResending}
          onResendAction={onResend}
        />
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      {/* Centered + polished action buttons */}
      <div className={styles.actions}>
        <Button type="submit" disabled={isVerifying} variant="primary" aria-busy={isVerifying}>
          {isVerifying ? (
            <span className="inline-flex items-center gap-2">
              <ClipLoader size={16} /> Verifying…
            </span>
          ) : (
            'Verify'
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onResend}
          disabled={!hydrated || isResending || cooldown > 0}
          aria-busy={isResending}
        >
          {isResending ? (
            <span className="inline-flex items-center gap-2">
              <ClipLoader size={16} /> Resending…
            </span>
          ) : cooldown > 0 ? (
            `Resend (${cooldown})`
          ) : (
            'Resend code'
          )}
        </Button>
      </div>
    </form>
  );
}
