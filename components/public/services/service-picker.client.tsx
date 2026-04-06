'use client';

import { useRouter } from 'next/navigation';
import styles from './services.module.css';

type ServicePickerItem = {
  id: string;
  slug: string;
  name: string;
  summary: string;
};

export function ServicePicker({
  services,
  selectedSlug,
}: {
  services: ServicePickerItem[];
  selectedSlug?: string;
}) {
  const router = useRouter();
  const isDetailPicker = Boolean(selectedSlug);
  const selectedService = services.find((service) => service.slug === selectedSlug);

  if (isDetailPicker) {
    return (
      <div className={styles.picker}>
        <label className={styles.pickerLabel} htmlFor="service-picker-detail">
          Switch service
        </label>
        <select
          id="service-picker-detail"
          className={`form-select ${styles.compactPickerSelect}`}
          value={selectedSlug ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            if (!value || value === selectedSlug) return;
            router.push(`/services/${value}`);
          }}
        >
          {services.map((service) => (
            <option key={service.id} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
        {selectedService?.summary ? (
          <p className={styles.compactPickerSummary}>{selectedService.summary}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.picker}>
      <label className={styles.pickerLabel} htmlFor="service-picker">
        Choose a service
      </label>
      <select
        id="service-picker"
        className="form-select"
        value={selectedSlug ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) return;
          router.push(`/services/${value}`);
        }}
      >
        <option value="">Select a service</option>
        {services.map((service) => (
          <option key={service.id} value={service.slug}>
            {service.name}
          </option>
        ))}
      </select>
    </div>
  );
}
