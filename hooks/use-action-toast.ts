// hooks/use-action-toast.ts
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type ActionState = {
  errors?: Record<string, string[]>;
  success?: boolean;
};

export function useActionToast(
  state: ActionState,
  pending: boolean,
  successMessage = 'Success!',
  errorMessage = 'Something went wrong',
  redirectTo?: string,
) {
  const router = useRouter();

  // Track the previous `pending` value so we can detect a real submit finishing
  const prevPendingRef = useRef(pending);

  useEffect(() => {
    const wasPending = prevPendingRef.current;
    prevPendingRef.current = pending;

    // Only fire toasts when a submission actually finished:
    // pending: true  -> false
    if (!wasPending || pending) {
      // Either it never was pending (first mount / no submit yet)
      // or it's still pending — do nothing.
      return;
    }

    // Now we know: a submit just completed.
    if (state?.success) {
      toast.success(successMessage);
      if (redirectTo) {
        router.push(redirectTo);
      }
    } else if (state?.errors) {
      const errorMsg = Object.values(state.errors).flat().join('\n') || errorMessage;
      toast.error(errorMsg);
    }
  }, [state, pending, successMessage, errorMessage, redirectTo, router]);
}
