import styles from '@/components/public/constituency/constituency-header/constituency-header.module.css';

export function MapCard({ src }: { src: string }) {
  return (
    <div className={`card ${styles.mapCard}`} data-aos="fade-up" data-aos-delay="100">
      <div className={styles.mapInner}>
        <iframe
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
