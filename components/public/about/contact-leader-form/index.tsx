'use client';

import { useState } from 'react';
import { HiCheckCircle } from 'react-icons/hi2';
import styles from '@/components/public/about/leadership-member-detail/background-section.module.css';

interface ContactLeaderFormProps {
  leaderId: string;
  leaderName: string;
  leaderPosition?: string;
}

export function ContactLeaderForm({
  leaderId, // reserved for future API integration
  leaderName,
  leaderPosition,
}: ContactLeaderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  console.log(leaderId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call that uses leaderId
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.contactSuccessCard}>
        <div className={styles.successIcon}>
          <HiCheckCircle />
        </div>
        <h3 className={styles.successTitle}>Message Sent Successfully!</h3>
        <p className={styles.successText}>
          Thank you for your message to {leaderName}. We&apos;ll get back to you
          as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className={styles.successButton}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className={styles.contactFormContainer}>
      <h3 className={styles.contactFormTitle}>
        Contact {leaderName}
      </h3>
      {leaderPosition && (
        <p className={styles.contactFormSubtitle}>{leaderPosition}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Your Name *
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="subject" className="form-label">
              Subject *
            </label>
            <select
              className="form-select"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select a subject</option>
              <option value="general-inquiry">General Inquiry</option>
              <option value="meeting-request">Meeting Request</option>
              <option value="collaboration">Collaboration Opportunity</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="message" className="form-label">
              Message *
            </label>
            <textarea
              className="form-control"
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder={`Please describe the purpose of your message to ${leaderName}...`}
              required
            />
          </div>

          <div className="col-12">
            <div className={styles.contactFormSubmitRow}>
              <button
                type="submit"
                className={styles.contactSubmitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </button>

              <p className={styles.contactFormNote}>
                * Required fields. Your message will be sent directly to {leaderName}
                &apos;s office.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
