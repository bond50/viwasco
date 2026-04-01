// components/reusables/sections/section.tsx
import styles from './section.module.css';
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'light' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Section({
  children,
  className = '',
  id,
  background = 'default',
  padding = 'lg',
}: SectionProps) {
  const sectionClass = `${styles.section} ${styles[`bg-${background}`]} ${styles[`padding-${padding}`]} ${className}`;

  return (
    <section id={id} className={sectionClass}>
      {children}
    </section>
  );
}
