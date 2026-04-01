'use client';

import styles from './two-fa.module.css';
import ClipLoader from 'react-spinners/ClipLoader';

type Props = {
  hydrated: boolean;
  cooldown: number;
  isResending: boolean;
  onResendAction: () => void;
};

export function ResendControls({ hydrated, cooldown, isResending, onResendAction }: Props) {
  return (
    <p className="text-muted small mb-0" aria-live="polite">
      Enter the 6-digit code we sent to your email.&nbsp;
      {!hydrated ? (
        <span aria-hidden="true">…</span>
      ) : cooldown > 0 ? (
        <span className={styles.countdown} suppressHydrationWarning>
          Resend in {cooldown}s
        </span>
      ) : (
        <button
          type="button"
          className={styles.linkBtn}
          onClick={onResendAction}
          disabled={isResending}
          aria-busy={isResending}
        >
          {isResending ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ClipLoader size={14} /> Resending…
            </span>
          ) : (
            'Resend code'
          )}
        </button>
      )}
    </p>
  );
}
