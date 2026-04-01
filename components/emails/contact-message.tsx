import type { CSSProperties } from 'react';
import * as React from 'react';
import { Heading, Section, Text } from '@react-email/components';
import { BaseEmail } from '@/components/emails/base-email';

type ContactMessageEmailProps = {
  title: string;
  intro: string;
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  contactType: string;
  message: string;
  accountNumber?: string | null;
  serviceArea?: string | null;
  reference?: string | null;
};

export function ContactMessageEmail(props: ContactMessageEmailProps) {
  const rows = [
    ['Type', props.contactType],
    ['Name', props.fullName],
    ['Email', props.email],
    props.phone ? ['Phone', props.phone] : null,
    ['Subject', props.subject],
    props.accountNumber ? ['Account Number', props.accountNumber] : null,
    props.serviceArea ? ['Service Area', props.serviceArea] : null,
    props.reference ? ['Reference', props.reference] : null,
  ].filter(Boolean) as Array<[string, string]>;

  return (
    <BaseEmail preview={props.title}>
      <Heading style={styles.h1}>{props.title}</Heading>
      <Text style={styles.p}>{props.intro}</Text>

      <Section style={styles.box}>
        {rows.map(([label, value]) => (
          <Text key={label} style={styles.row}>
            <strong>{label}:</strong> {value}
          </Text>
        ))}
      </Section>

      <Text style={styles.message}>{props.message}</Text>
    </BaseEmail>
  );
}

const styles: Record<string, CSSProperties> = {
  h1: { fontSize: 24, margin: 0 },
  p: { fontSize: 14, lineHeight: '22px' },
  box: {
    padding: '16px 18px',
    backgroundColor: '#f7f9fc',
    borderRadius: 8,
    margin: '16px 0',
  },
  row: { fontSize: 14, lineHeight: '22px', margin: '0 0 6px' },
  message: { fontSize: 14, lineHeight: '22px', whiteSpace: 'pre-wrap' },
};
