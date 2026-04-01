'use client';

import { startTransition, useMemo, useState, type FormEvent } from 'react';
import { useFormAction } from '@/hooks/use-form-action';
import { updateOrganizationAdminAccess } from '@/actions/organization/admin-access';
import type { AdminAccessValues } from '@/lib/schemas/about/organization/admin-access';
import { FormError } from '@/components/form-error';

type Props = {
  orgId: string;
  initial: { emails: string[]; bootstrap: boolean };
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const norm = (v: string) => v.trim().toLowerCase();

function normalizeEmails(emails: string[]): string[] {
  return Array.from(new Set(emails.map(norm))).sort();
}

export function AdminAccessTab({ orgId, initial }: Props) {
  const [emails, setEmails] = useState<string[]>(
    normalizeEmails(Array.isArray(initial.emails) ? initial.emails : []),
  );
  const [draft, setDraft] = useState('');
  const [bootstrap, setBootstrap] = useState<boolean>(initial.bootstrap);

  const { formAction, pending, state, formError } = useFormAction<AdminAccessValues>(
    updateOrganizationAdminAccess.bind(null, orgId),
    {
      successMessage: 'Allowlist updated',
      errorMessage: 'Failed to update allowlist',
    },
  );

  const draftValid = useMemo(() => emailRegex.test(norm(draft)), [draft]);
  const normalizedEmails = useMemo(() => normalizeEmails(emails), [emails]);
  const viewEmails = normalizedEmails;
  const checkedBootstrap = bootstrap;

  const addDraft = () => {
    const email = norm(draft);
    if (!emailRegex.test(email)) return;
    setEmails((prev) => normalizeEmails([...prev, email]));
    setDraft('');
  };

  const removeAt = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const emailsError = Array.isArray(state?.errors?.emails)
    ? state?.errors?.emails.join(', ')
    : state?.errors?.emails;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="pt-1">
      <input type="hidden" name="emails" value={JSON.stringify(viewEmails)} />
      <div className="row gy-4">
        <div className="col-12 ">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                <h6 className="card-title mb-0">Admin bootstrap</h6>
                <span
                  className={`badge ${checkedBootstrap ? 'text-bg-success' : 'text-bg-secondary'}`}
                >
                  {checkedBootstrap ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-muted small mb-2">
                {checkedBootstrap
                  ? 'Anyone on the allowlist is promoted to ADMIN upon login.'
                  : 'Allowlisted users stay at their current role until bootstrap is enabled.'}
              </p>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="admin-bootstrap"
                  name="bootstrap"
                  checked={checkedBootstrap}
                  onChange={(e) => setBootstrap(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="admin-bootstrap">
                  Enable admin bootstrap
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 ">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="card-title mb-0">Admin allowlist</h6>
                {viewEmails.length > 0 && (
                  <span className="badge text-bg-light">{viewEmails.length} email(s)</span>
                )}
              </div>

              <div className="input-group">
                <input
                  type="email"
                  className={`form-control ${draft.length ? (draftValid ? 'is-valid' : 'is-invalid') : ''}`}
                  placeholder="e.g. admin@example.com"
                  aria-label="Allowlisted admin email"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDraft();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={addDraft}
                  disabled={!draftValid}
                >
                  Add
                </button>
              </div>

              {viewEmails.length > 0 ? (
                <ul className="list-group list-group-flush mt-3 border rounded">
                  {viewEmails.map((email, index) => (
                    <li
                      key={email}
                      className="list-group-item d-flex align-items-center justify-content-between"
                    >
                      <span className="text-wrap">{email}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => removeAt(index)}
                        aria-label={`Remove ${email}`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-secondary mt-3 mb-0 py-2 small" role="status">
                  No emails added yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <FormError message={emailsError ?? formError} />
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setDraft('');
                setEmails(normalizeEmails(Array.isArray(initial.emails) ? initial.emails : []));
                setBootstrap(initial.bootstrap);
              }}
              disabled={pending}
            >
              Reset
            </button>
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
