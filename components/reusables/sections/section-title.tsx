// components/reusables/sections/section-title.tsx
import styles from './section-title.module.css';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string | null;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export function SectionTitle({
  title,
  subtitle,
  description,
  align = 'center',
  size = 'md',
}: SectionTitleProps) {
  return (
    <div
      className={`${styles['section-title']} ${styles[`align-${align}`]} ${styles[`size-${size}`]}`}
    >
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
