import styles from './card-header.module.css';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface HeaderProps {
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string; // optional override for logo path
  showLogo?: boolean;
}

const sizeClass = (s: 'sm' | 'md' | 'lg') =>
  s === 'sm' ? styles.sizeSm : s === 'md' ? styles.sizeMd : styles.sizeLg;

export const CardHeader = ({
  label,
  className,
  size = 'sm',
  src = '/assets/img/logo.png',
  showLogo = true,
}: HeaderProps) => {
  return (
    <div className={cn(styles.cardHeader, className)}>
      {showLogo && (
        <div className={cn(styles.logoContainer, sizeClass(size))}>
          <Image
            src={src}
            alt={`${process.env.NEXT_PUBLIC_APP_NAME ?? 'Company'} Logo`}
            width={505}
            height={494}
            className={styles.logo}
            sizes="(max-width: 480px) 120px, (max-width: 768px) 160px, 282px"
            priority
          />
        </div>
      )}
      <p className={styles.cardSubtitle}>{label}</p>
    </div>
  );
};
