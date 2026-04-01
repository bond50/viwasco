'use client';

import React, { useEffect, useRef } from 'react';
import styles from './confirmationModal.module.css';

type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

type Size = 'sm' | 'lg' | 'xl';
type AlertVariant = 'danger' | 'warning' | 'info' | 'success';

interface BsModal {
  show: () => void;
  hide: () => void;
}

interface BsModalStatic {
  getOrCreateInstance: (element: Element) => BsModal;
}

interface Props {
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: Variant;
  size?: Size;
  centered?: boolean;
  staticBackdrop?: boolean;
  alertVariant?: AlertVariant;
  confirmDisabled?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;

  /** Controlled visibility. If provided, Bootstrap state will sync to this. */
  show?: boolean;
}

export function ConfirmationModal({
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  size,
  centered = true,
  staticBackdrop = false,
  alertVariant = 'danger',
  confirmDisabled = false,
  onConfirm,
  onCancel,
  show,
}: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<BsModal | null>(null);

  const alertClass =
    alertVariant === 'warning'
      ? styles.alertWarning
      : alertVariant === 'info'
        ? styles.alertInfo
        : alertVariant === 'success'
          ? styles.alertInfo /* add .alertSuccess in CSS if needed */
          : styles.alertDanger;

  const dialogClass: string[] = ['modal-dialog'];
  if (size) dialogClass.push(`modal-${size}`);
  if (centered) dialogClass.push('modal-dialog-centered');

  // Keep Bootstrap Modal instance in sync with `show`
  useEffect(() => {
    if (typeof show === 'undefined') return;

    let removeHiddenListener: (() => void) | undefined;

    (async () => {
      const mod = (await import('bootstrap/js/dist/modal')) as { default: BsModalStatic };
      if (!modalRef.current) return;

      const ModalCtor = mod.default;
      const inst = ModalCtor.getOrCreateInstance(modalRef.current);
      instanceRef.current = inst;

      const onHidden: EventListener = () => {
        // Notify parent when closed via ESC/backdrop/×
        onCancel?.();
      };
      modalRef.current.addEventListener('hidden.bs.modal', onHidden);
      removeHiddenListener = () => {
        modalRef.current?.removeEventListener('hidden.bs.modal', onHidden);
      };

      if (show) inst.show();
      else inst.hide();
    })();

    return () => {
      if (removeHiddenListener) removeHiddenListener();
    };
  }, [show, onCancel]);

  return (
    <div
      className={`modal fade ${styles.modal}`}
      tabIndex={-1}
      aria-hidden="true"
      {...(staticBackdrop ? { 'data-bs-backdrop': 'static', 'data-bs-keyboard': 'false' } : {})}
      ref={modalRef}
    >
      <div className={dialogClass.join(' ')}>
        <div className="modal-content">
          <div className={`modal-header ${styles.modalHeader}`}>
            <h5 className={`modal-title ${styles.modalTitle}`}>{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onCancel}
            />
          </div>

          <div className={`modal-body ${styles.modalBody}`}>
            <div className={`${styles.alert} ${alertClass}`} role="alert">
              {message}
            </div>
          </div>

          <div className={`modal-footer ${styles.modalFooter}`}>
            <button
              type="button"
              className={`btn btn-outline-secondary ${styles.cancelButton}`}
              data-bs-dismiss="modal"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn btn-${variant} ${styles.confirmButton}`}
              data-bs-dismiss="modal"
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
