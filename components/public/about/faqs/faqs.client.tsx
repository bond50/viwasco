// components/public/about/faqs/faqs.client.tsx
'use client';

import React, { useMemo, useState } from 'react';
import styles from './faqs.module.css';
import { cn } from '@/lib/utils';

export type PublicFaq = {
  id: string;
  question: string;
  answer: string;
  rank: number;
};

type Props = {
  faqs: PublicFaq[];
};

export function FaqsViewClient({ faqs }: Props) {
  const rows = useMemo(
    () => [...faqs].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)),
    [faqs],
  );

  const [open, setOpen] = useState<string | null>(rows[0]?.id ?? null);

  if (!rows.length) return null;

  return (
    <section className={cn('section', 'default-background')}>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className={styles.accordion}>
          {rows.map((f) => (
            <div key={f.id} className={styles.item}>
              <button
                className={styles.header}
                onClick={() => setOpen(open === f.id ? null : f.id)}
                aria-expanded={open === f.id}
              >
                <span className={styles.q}>{f.question}</span>
                <span className={styles.icon} aria-hidden>
                  {open === f.id ? '-' : '+'}
                </span>
              </button>

              {open === f.id && (
                <div className={styles.body}>
                  <p>{f.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
