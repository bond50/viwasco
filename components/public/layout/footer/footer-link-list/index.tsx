import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from '@/components/public/layout/footer/footer.module.css';

type LinkItem = {
  text: string;
  url: string;
};

type Props = {
  links: LinkItem[];
};

export const FooterLinkList: React.FC<Props> = ({ links }) => {
  return (
    <ul className={styles.footerLinks}>
      {links.map((link) => (
        <li key={link.url} className={styles.footerLinkItem}>
          <FiArrowRight className={styles.footerLinkIcon} />
          <Link href={link.url} className={styles.footerLinkAnchor}>
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};
