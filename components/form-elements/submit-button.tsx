'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Button } from '@/components/form-elements/button';
import { ClipLoader } from '@/components/common/spinners';

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, 'children' | 'type'> & {
  /** Whether the action is currently pending/loading */
  pending?: boolean;
  /** Label to show when idle (e.g. "Create", "Update") */
  label: ReactNode;
  /** Optional label while pending; defaults to `${label}…` if label is a string */
  labelPending?: ReactNode;
  /** Show the spinner while pending (default: true) */
  showSpinner?: boolean;
  /** Spinner size in px (default: 16) */
  spinnerSize?: number;
};

/** Generic submit button with a spinner + pending label */
export function SubmitButton({
  pending = false,
  label,
  labelPending,
  showSpinner = true,
  spinnerSize = 16,
  variant = 'primary',
  ...rest
}: SubmitButtonProps) {
  const pendingContent = labelPending ?? (typeof label === 'string' ? `${label}…` : 'Working…');

  return (
    <Button type="submit" variant={variant} isLoading={pending} {...rest}>
      {pending ? (
        <span className="d-inline-flex align-items-center gap-2">
          {showSpinner && <ClipLoader size={spinnerSize} />}
          {pendingContent}
        </span>
      ) : (
        label
      )}
    </Button>
  );
}

/** Convenience wrapper for the common Create/Update case */
export function SaveUpdateButton({
  isEdit,
  pending,
  ...rest
}: Omit<SubmitButtonProps, 'label' | 'labelPending'> & { isEdit?: boolean }) {
  const label = isEdit ? 'Update' : 'Create';
  const labelPending = isEdit ? 'Updating…' : 'Creating…';
  return <SubmitButton pending={pending} label={label} labelPending={labelPending} {...rest} />;
}
