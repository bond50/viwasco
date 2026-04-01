'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import CardWrapper from '@/components/card/card-wrapper';
import { Input } from '@/components/form-elements/input';
import { Button } from '@/components/form-elements/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { TurnstileWidget } from '@/components/security/turnstile-widget';
import { useFormAction } from '@/hooks/use-form-action';
import { submitContactMessage } from '@/actions/contact-messages';
import type { ContactMessageFormValues } from '@/lib/schemas/contact';
import styles from './contact.module.css';

export function ContactFormCard() {
  const [contactType, setContactType] = useState<'ENQUIRY' | 'COMPLAINT'>('ENQUIRY');
  const [consent, setConsent] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState('');

  const isComplaint = contactType === 'COMPLAINT';

  const { formAction, pending, state, getError, formError } = useFormAction<ContactMessageFormValues>(submitContactMessage, {
    successMessage: 'Your message has been sent.',
    errorMessage: 'Failed to send your message',
  });

  useEffect(() => {
    if (!state?.success) return;

    const timer = window.setTimeout(() => {
      setFormKey((n) => n + 1);
      setContactType('ENQUIRY');
      setConsent(false);
      setTurnstileToken('');
    }, 0);

    return () => window.clearTimeout(timer);
  }, [state?.success]);

  const requiredFields = useMemo(
    () => (isComplaint ? ['Account Number', 'Service Area'] : ['Subject']),
    [isComplaint],
  );

  return (
    <CardWrapper
      headerLabel=""
      backButtonLabel=""
      showLogo={false}
      className={styles.formCard}
    >
      <form key={formKey} action={formAction} className={styles.formBody}>
        <div className="mb-3">
          <label className="form-label" htmlFor="contactType">
            Contact Type
          </label>
          <select
            id="contactType"
            name="contactType"
            className="form-control"
            value={contactType}
            onChange={(e) => setContactType(e.target.value as 'ENQUIRY' | 'COMPLAINT')}
          >
            <option value="ENQUIRY">Enquiry</option>
            <option value="COMPLAINT">Complaint</option>
          </select>
        </div>

        <div className={styles.formRow}>
          <Input
            name="fullName"
            label="Full Name"
            placeholder="Jane Doe"
            required
            defaultValue={(state?.values?.fullName as string) ?? ''}
            error={getError('fullName')}
          />
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="jane@domain.com"
            required
            defaultValue={(state?.values?.email as string) ?? ''}
            error={getError('email')}
          />
        </div>

        <div className={styles.formRow}>
          <Input
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="+254 7xx xxx xxx"
            defaultValue={(state?.values?.phone as string) ?? ''}
            error={getError('phone')}
          />
          {isComplaint ? (
            <Input
              name="accountNumber"
              label="Account Number"
              placeholder="ACC-000123"
              defaultValue={(state?.values?.accountNumber as string) ?? ''}
              error={getError('accountNumber')}
            />
          ) : (
            <Input
              name="subject"
              label="Subject"
              placeholder="How can we help?"
              required
              defaultValue={(state?.values?.subject as string) ?? ''}
              error={getError('subject')}
            />
          )}
        </div>

        {isComplaint && (
          <>
            <input type="hidden" name="subject" value="Service complaint" />
            <div className={styles.formRow}>
              <Input
                name="serviceArea"
                label="Service Area"
                placeholder="Zone / Estate"
                defaultValue={(state?.values?.serviceArea as string) ?? ''}
                error={getError('serviceArea')}
              />
              <Input
                name="reference"
                label="Reference (Optional)"
                placeholder="Ticket or meter ID"
                defaultValue={(state?.values?.reference as string) ?? ''}
                error={getError('reference')}
              />
            </div>
          </>
        )}

        <Input
          name="message"
          label={isComplaint ? 'Complaint Details' : 'Message'}
          as="textarea"
          placeholder={
            isComplaint
              ? 'Describe the issue you are experiencing.'
              : 'Tell us more about your enquiry.'
          }
          rows={5}
          required
          defaultValue={(state?.values?.message as string) ?? ''}
          error={getError('message')}
        />

        <div className={styles.turnstileWrap}>
          <TurnstileWidget value={turnstileToken} onChange={setTurnstileToken} />
        </div>

        <div className={styles.consentRow}>
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <label htmlFor="consent">
            I agree to the{' '}
            <Link href="/terms" className="link-primary">
              Terms &amp; Conditions
            </Link>
            .
          </label>
        </div>

        <div className="mt-4">
          <Button type="submit" variant="primary" disabled={!consent || !turnstileToken || pending}>
            {pending ? 'Submitting...' : `Submit ${isComplaint ? 'Complaint' : 'Enquiry'}`}
          </Button>
        </div>

        <div className="mt-3 text-muted small">
          Required fields for this type: {requiredFields.join(', ')}
        </div>

        <FormError message={formError ?? undefined} />
        <FormSuccess message={state?.success ? 'Message sent successfully.' : undefined} />
      </form>
    </CardWrapper>
  );
}
