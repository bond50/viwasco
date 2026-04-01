import Link from 'next/link';
import { HiOutlineArrowRightCircle } from 'react-icons/hi2';
import styles from '@/components/reusables/cta-link/cta-link.module.css';

type CtaLinkProps = {
  href: string;
  label: string;
  delay?: number;
  uppercase?: boolean;
};

export function CtaLink({ href, label, uppercase, delay = 600 }: CtaLinkProps) {
  return (
    <div className={styles.CtaLink} data-aos="fade-up" data-aos-delay={delay}>
      <Link href={href} className={styles.BtnLink}>
        {uppercase ? <span>{label.toUpperCase()}</span> : <span>{label}</span>}
        <HiOutlineArrowRightCircle className={styles.ArrowIcon} />
      </Link>
    </div>
  );
}
