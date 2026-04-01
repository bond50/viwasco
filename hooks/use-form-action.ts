'use client';
'use no memo';

import { useActionState } from 'react';
import { useActionToast } from './use-action-toast';
import { getFieldError } from '@/lib/form-error';

export type ActionState<T> = {
  errors?: Record<string, string[]>;
  values?: Partial<T>;
  success?: boolean;
};

export function useFormAction<TFormValues>(
  actionFn: (
    prevState: ActionState<TFormValues>,
    formData: FormData,
  ) => Promise<ActionState<TFormValues>>,
  {
    successMessage = 'Success!',
    errorMessage = 'Something went wrong',
    redirectTo,
    initialState = {},
  }: {
    successMessage?: string;
    errorMessage?: string;
    redirectTo?: string;
    initialState?: ActionState<TFormValues>;
  } = {},
) {
  const [state, formAction, pending] = useActionState(actionFn, initialState);
  useActionToast(state, pending, successMessage, errorMessage, redirectTo);
  const viewState = state?.success && !state?.errors ? { ...state, values: undefined } : state;

  // Overloads preserve IntelliSense for top-level keys, but still allow dotted strings.
  function _getError(field: keyof TFormValues): string | undefined;
  function _getError(field: string): string | undefined;
  function _getError(field: keyof TFormValues | string): string | undefined {
    return getFieldError(viewState?.errors, field as string);
  }

  return {
    formAction,
    pending,
    state: viewState,
    getError: _getError,
    formError: viewState?.errors?._form?.[0] || null,
  };
}
