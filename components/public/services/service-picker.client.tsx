'use client';

import { useRouter } from 'next/navigation';
import styles from './services.module.css';

type ServicePickerItem = {
  id: string;
  slug: string;
  name: string;
};

export function ServicePicker({
  services,
  selectedSlug,
}: {
  services: ServicePickerItem[];
  selectedSlug?: string;
}) {
  const router = useRouter();

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
