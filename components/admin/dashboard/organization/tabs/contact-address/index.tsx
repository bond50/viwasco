'use client';

import { useEffect, useMemo, useState } from 'react';
import { BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';
import { useFormAction } from '@/hooks/use-form-action';
import { useRemountOnRefresh } from '@/hooks/use-remount-on-refresh';
import { Input } from '@/components/form-elements/input';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';
import { isValidUrl } from '@/lib/utils';
import type { ContactAddressState, NavigationVisibilityState } from '@/lib/types/about';
import { OrganisationContactValues } from '@/lib/schemas/about/organization/contact';
import { updateOrganizationContact } from '@/actions/organization';

type Props = { orgId: string; initial: ContactAddressState };

type ServiceCentreRow = {
  id: string;
  name: string;
  address: string;
};

type QaIssue = {
  title: string;
  detail: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normEmail = (value: string) => value.trim().toLowerCase();

const NAV_KEYS: Array<keyof NonNullable<NavigationVisibilityState>> = [
  'about',
  'services',
  'projects',
  'resources',
  'news',
  'tenders',
  'careers',
  'newsletters',
  'contact',
];

const DEFAULT_NAV_VISIBILITY: Required<
  Record<keyof NonNullable<NavigationVisibilityState>, boolean>
> = {
  about: true,
  services: true,
  projects: true,
  resources: true,
  news: true,
  tenders: true,
  careers: true,
  newsletters: true,
  contact: true,
};

function normalizeCentres(input: unknown): ServiceCentreRow[] {
  if (!Array.isArray(input)) return [];

  return input.map((item, index) => {
    if (!item || typeof item !== 'object') {
      return {
        id: `centre-${index}`,
        name: '',
        address: '',
      };
    }

    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' && row.id.trim().length > 0 ? row.id : `centre-${index}`;
    const name = typeof row.name === 'string' ? row.name : '';
    const address = typeof row.address === 'string' ? row.address : '';

    return { id, name, address };
  });
}

function normalizeVisibility(input: unknown): NavigationVisibilityState {
  const row = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  return NAV_KEYS.reduce((acc, key) => {
    acc[key] = typeof row[key] === 'boolean' ? (row[key] as boolean) : DEFAULT_NAV_VISIBILITY[key];
    return acc;
  }, {} as NavigationVisibilityState);
}

function normalizeEmails(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return Array.from(
    new Set(
      input
        .filter((value): value is string => typeof value === 'string')
        .map(normEmail)
        .filter((value) => value.length > 0),
    ),
  ).sort();
}

function isBlank(value?: string | null) {
  return !value || value.trim().length === 0;
}

export function ContactAddressTab({ orgId, initial }: Props) {
  const { formAction, pending, state, getError, formError } =
    useFormAction<OrganisationContactValues>(updateOrganizationContact.bind(null, orgId), {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    });

  const [portalEnabled, setPortalEnabled] = useState<boolean>(
    initial.customerPortalEnabled ?? false,
  );
  const [serviceCentres, setServiceCentres] = useState<ServiceCentreRow[]>(
    normalizeCentres(initial.serviceCentres),
  );
  const [navigationVisibility, setNavigationVisibility] = useState<NavigationVisibilityState>(
    normalizeVisibility(initial.navigationVisibility),
  );
  const [recipientEmails, setRecipientEmails] = useState<string[]>(
    normalizeEmails(initial.contactRecipientEmails),
  );
  const [recipientDraft, setRecipientDraft] = useState('');
  const formKey = useRemountOnRefresh(state?.success, initial);

  const currentPortalEnabled =
    typeof state?.values?.customerPortalEnabled === 'boolean'
      ? state.values.customerPortalEnabled
      : (initial.customerPortalEnabled ?? false);

  const currentCentres = useMemo(
    () => normalizeCentres(state?.values?.serviceCentres ?? initial.serviceCentres),
    [initial.serviceCentres, state?.values?.serviceCentres],
  );

  const currentNavigationVisibility = useMemo(
    () => normalizeVisibility(state?.values?.navigationVisibility ?? initial.navigationVisibility),
    [initial.navigationVisibility, state?.values?.navigationVisibility],
  );

  const currentRecipientEmails = useMemo(
    () => normalizeEmails(state?.values?.contactRecipientEmails ?? initial.contactRecipientEmails),
    [initial.contactRecipientEmails, state?.values?.contactRecipientEmails],
  );

  const qaIssues = useMemo<QaIssue[]>(() => {
    const websiteUrl = (state?.values?.websiteUrl ?? initial.websiteUrl ?? '').trim();
    const contactEmail = (state?.values?.contactEmail ?? initial.contactEmail ?? '').trim();
    const phone = (state?.values?.phone ?? initial.phone ?? '').trim();
    const address = (state?.values?.address ?? initial.address ?? '').trim();
    const footerAboutText = (
      state?.values?.footerAboutText ??
      initial.footerAboutText ??
      ''
    ).trim();
    const portalUrl = (state?.values?.customerPortalUrl ?? initial.customerPortalUrl ?? '').trim();

    const issues: QaIssue[] = [];

    if (isBlank(address)) {
      issues.push({
        title: 'Head office address is missing',
        detail:
          'Add the main office address so the public contact page and footer do not show a gap.',
      });
    }
    if (isBlank(contactEmail)) {
      issues.push({
        title: 'Contact email is missing',
        detail: 'Provide a public contact email so customers can reach the utility by email.',
      });
    }
    if (isBlank(phone)) {
      issues.push({
        title: 'Phone number is missing',
        detail: 'Add a contact phone number so the contact page has at least one direct line.',
      });
    }
    if (isBlank(websiteUrl)) {
      issues.push({
        title: 'Website URL is missing',
        detail: 'Add the public website address so org metadata stays complete.',
      });
    }
    if (isBlank(footerAboutText)) {
      issues.push({
        title: 'Footer copy is empty',
        detail:
          'Write a short customer-facing footer description instead of leaving the public footer blank.',
      });
    }
    if (currentRecipientEmails.length === 0) {
      issues.push({
        title: 'No contact recipients are configured',
        detail:
          'Add at least one admin recipient email so contact form notifications do not depend on the public contact email fallback.',
      });
    }
    if (currentPortalEnabled && isBlank(portalUrl)) {
      issues.push({
        title: 'Customer portal is enabled but no URL is set',
        detail: 'Either add the portal link or disable the portal until it is ready.',
      });
    } else if (!isBlank(portalUrl) && !isValidUrl(portalUrl)) {
      issues.push({
        title: 'Customer portal URL is invalid',
        detail: 'Use a full https:// URL so the public portal link resolves correctly.',
      });
    }
    if ((currentCentres?.length ?? 0) === 0) {
      issues.push({
        title: 'No service centres are configured',
        detail:
          'Add at least one service centre so the public contact page has local offices to display.',
      });
    }

    return issues;
  }, [
    currentCentres,
    currentPortalEnabled,
    currentRecipientEmails.length,
    initial.address,
    initial.contactEmail,
    initial.customerPortalUrl,
    initial.footerAboutText,
    initial.phone,
    initial.websiteUrl,
    state?.values?.address,
    state?.values?.contactEmail,
    state?.values?.customerPortalUrl,
    state?.values?.footerAboutText,
    state?.values?.phone,
    state?.values?.websiteUrl,
  ]);

  useEffect(() => {
    setPortalEnabled(currentPortalEnabled);
  }, [currentPortalEnabled]);

  useEffect(() => {
    setServiceCentres(currentCentres);
  }, [currentCentres]);

  useEffect(() => {
    setNavigationVisibility(currentNavigationVisibility);
  }, [currentNavigationVisibility]);

  useEffect(() => {
    setRecipientEmails(currentRecipientEmails);
  }, [currentRecipientEmails]);

  const addCentre = () => {
    setServiceCentres((prev) => [
      ...prev,
      {
        id:
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `centre-${Date.now()}-${prev.length}`,
        name: '',
        address: '',
      },
    ]);
  };

  const updateCentre = (index: number, key: keyof ServiceCentreRow, value: string) => {
    setServiceCentres((prev) =>
      prev.map((centre, i) => (i === index ? { ...centre, [key]: value } : centre)),
    );
  };

  const removeCentre = (index: number) => {
    setServiceCentres((prev) => prev.filter((_, i) => i !== index));
  };

  const setNavVisibility = (key: keyof NavigationVisibilityState, value: boolean) => {
    setNavigationVisibility((prev) => ({ ...prev, [key]: value }));
  };

  const addRecipient = () => {
    const email = normEmail(recipientDraft);
    if (!emailRegex.test(email)) return;
    setRecipientEmails((prev) => normalizeEmails([...prev, email]));
    setRecipientDraft('');
  };

  const removeRecipient = (index: number) => {
    setRecipientEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const recipientDraftValid =
    recipientDraft.length === 0 || emailRegex.test(normEmail(recipientDraft));
  const recipientsError = Array.isArray(state?.errors?.contactRecipientEmails)
    ? state.errors.contactRecipientEmails.join(', ')
    : state?.errors?.contactRecipientEmails;

  return (
    <form key={formKey} action={formAction}>
      <input type="hidden" name="serviceCentres" value={JSON.stringify(serviceCentres)} />
      <input
        type="hidden"
        name="navigationVisibility"
        value={JSON.stringify(navigationVisibility)}
      />
      <input type="hidden" name="contactRecipientEmails" value={JSON.stringify(recipientEmails)} />

      <div
        className={`alert ${qaIssues.length > 0 ? 'alert-warning' : 'alert-success'} d-flex gap-3 align-items-start mb-3`}
      >
        <div className="pt-1">
          {qaIssues.length > 0 ? <BsExclamationTriangle size={20} /> : <BsCheckCircle size={20} />}
        </div>
        <div className="flex-grow-1">
          <div className="fw-semibold mb-1">
            {qaIssues.length > 0 ? 'Content QA needs attention' : 'Content QA looks clean'}
          </div>
          {qaIssues.length > 0 ? (
            <>
              <div className="small mb-2">
                Review these items before publishing changes to the public site.
              </div>
              <ul className="mb-0 ps-3 small">
                {qaIssues.map((issue) => (
                  <li key={issue.title} className="mb-1">
                    <strong>{issue.title}:</strong> {issue.detail}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="small mb-0">
              The current public contact and footer content has no obvious gaps.
            </div>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <h6 className="card-title mb-3">Contact information</h6>
          <div className="row mb-3">
            <div className="col-md-4">
              <Input
                name="websiteUrl"
                label="Website URL"
                placeholder="eg https://amatsiwater.co.ke"
                defaultValue={state?.values?.websiteUrl ?? initial.websiteUrl ?? ''}
                error={getError('websiteUrl')}
              />
            </div>
            <div className="col-md-4">
              <Input
                name="contactEmail"
                label="Contact Email"
                type="email"
                placeholder="e.g. info@viwasco.co.ke"
                defaultValue={state?.values?.contactEmail ?? initial.contactEmail ?? ''}
                error={getError('contactEmail')}
              />
            </div>
            <div className="col-md-4">
              <Input
                name="phone"
                placeholder="e.g. +254 700 000000"
                label="Phone"
                defaultValue={state?.values?.phone ?? initial.phone ?? ''}
                error={getError('phone')}
              />
            </div>
          </div>

          <div className="mb-0">
            <Input
              name="address"
              label="Head Office Address"
              as="textarea"
              defaultValue={state?.values?.address ?? initial.address ?? ''}
              error={getError('address')}
            />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div>
              <h6 className="card-title mb-1">Contact message recipients</h6>
              <p className="text-muted small mb-0">
                These admin emails receive public contact form submissions. If this list is empty,
                the system falls back to the public contact email.
              </p>
            </div>
            {recipientEmails.length > 0 ? (
              <span className="badge text-bg-light">{recipientEmails.length} email(s)</span>
            ) : null}
          </div>

          <div className="input-group mt-3">
            <input
              type="email"
              className={`form-control ${recipientDraft.length ? (recipientDraftValid ? 'is-valid' : 'is-invalid') : ''}`}
              placeholder="e.g. support@viwasco.co.ke"
              aria-label="Contact message recipient email"
              value={recipientDraft}
              onChange={(e) => setRecipientDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRecipient();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={addRecipient}
              disabled={!emailRegex.test(normEmail(recipientDraft))}
            >
              Add
            </button>
          </div>

          {recipientEmails.length > 0 ? (
            <ul className="list-group list-group-flush mt-3 border rounded">
              {recipientEmails.map((email, index) => (
                <li
                  key={email}
                  className="list-group-item d-flex align-items-center justify-content-between"
                >
                  <span className="text-wrap">{email}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => removeRecipient(index)}
                    aria-label={`Remove ${email}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-secondary mt-3 mb-0 py-2 small" role="status">
              No recipient emails added yet.
            </div>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <h6 className="card-title mb-3">Footer about text</h6>
          <p className="text-muted small mb-3">
            This text appears in the public footer. Keep it concise and customer-facing.
          </p>
          <Input
            name="footerAboutText"
            as="textarea"
            label="Footer about text"
            defaultValue={state?.values?.footerAboutText ?? initial.footerAboutText ?? ''}
            error={getError('footerAboutText')}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
            <div>
              <h6 className="card-title mb-1">Customer portal</h6>
              <p className="text-muted small mb-0">
                Enable this only when the portal URL is live. When turned on, it appears in the main
                navigation.
              </p>
            </div>
            <div className="form-check form-switch mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="customer-portal-enabled"
                name="customerPortalEnabled"
                checked={portalEnabled}
                onChange={(e) => setPortalEnabled(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="customer-portal-enabled">
                Enabled
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <Input
                name="customerPortalLabel"
                label="Portal label"
                placeholder="Customer Portal"
                defaultValue={
                  state?.values?.customerPortalLabel ??
                  initial.customerPortalLabel ??
                  'Customer Portal'
                }
                error={getError('customerPortalLabel')}
              />
            </div>
            <div className="col-md-8">
              <Input
                name="customerPortalUrl"
                label="Portal link"
                placeholder="https://portal.example.com"
                defaultValue={state?.values?.customerPortalUrl ?? initial.customerPortalUrl ?? ''}
                error={getError('customerPortalUrl')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
            <div>
              <h6 className="card-title mb-1">Header visibility</h6>
              <p className="text-muted small mb-0">
                Hide a top-level item when the section is not ready or should not appear in the
                public menu.
              </p>
            </div>
          </div>

          <div className="row g-3">
            {NAV_KEYS.map((key) => (
              <div className="col-md-4" key={key}>
                <div className="form-check form-switch border rounded px-3 py-2 h-100 d-flex align-items-center justify-content-between gap-3">
                  <label className="form-check-label mb-0" htmlFor={`nav-${key}`}>
                    {key[0].toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    className="form-check-input ms-0"
                    type="checkbox"
                    role="switch"
                    id={`nav-${key}`}
                    checked={navigationVisibility[key] ?? true}
                    onChange={(e) => setNavVisibility(key, e.target.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
            <div>
              <h6 className="card-title mb-1">Service centres</h6>
              <p className="text-muted small mb-0">
                Add the locations that should appear on the public contact page.
              </p>
            </div>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addCentre}>
              Add centre
            </button>
          </div>

          {serviceCentres.length > 0 ? (
            <div className="d-grid gap-3">
              {serviceCentres.map((centre, index) => (
                <div key={centre.id} className="border rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <strong>Centre {index + 1}</strong>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => removeCentre(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="East Office"
                        value={centre.name}
                        onChange={(e) => updateCentre(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        placeholder="Industrial Road, East Zone"
                        value={centre.address}
                        onChange={(e) => updateCentre(index, 'address', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-secondary mb-0">No service centres added yet.</div>
          )}
        </div>
      </div>

      <FormError message={recipientsError ?? formError ?? undefined} />
      <SaveUpdateButton isEdit pending={pending} variant="primary" />
    </form>
  );
}
