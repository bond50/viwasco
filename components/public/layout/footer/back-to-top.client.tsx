'use client';

import React from 'react';
import { FiArrowUp } from 'react-icons/fi';
import styles from '@/components/public/layout/footer/footer.module.css';

export function BackToTopButton() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={styles.backToTop}
      aria-label="Back to top"
      onClick={handleClick}
    >
      <FiArrowUp />
    </button>
  );
}
