import styles from '@/components/public/constituency/constituency-header/constituency-header.module.css';

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}
