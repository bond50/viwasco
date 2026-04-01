'use client';

import { useState } from 'react';
import { Input } from '@/components/form-elements/input';
import { Button } from '@/components/form-elements/button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Select } from '@/components/form-elements/select';
import type { GenericOption } from '@/components/form-elements/select/types';
import styles from './working-hours-input.module.css';
import type { WorkingHours, WorkingHoursRow } from '@/lib/types/working-hours';

// helper
function toSingle<T>(v: T | readonly T[] | null): T | null {
  if (Array.isArray(v)) return (v[0] ?? null) as T | null;
  return v as T | null;
}

interface WorkingHoursInputProps {
  name: string;
  defaultValue?: WorkingHours | null;
  error?: string;
}

const dayOptions = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' },
  { value: 'Monday to Saturday', label: 'Monday to Saturday' },
  { value: 'Weekdays', label: 'Weekdays (Mon-Fri)' },
  { value: 'Weekends', label: 'Weekends (Sat-Sun)' },
  { value: 'Everyday', label: 'Everyday' },
] as const;

export const WorkingHoursInput = ({ name, defaultValue, error }: WorkingHoursInputProps) => {
  const initialRows: WorkingHours =
    defaultValue && defaultValue.length > 0
      ? defaultValue
      : [{ days: 'Weekdays', hours: '8:00 AM - 5:00 PM' }];

  const [workingHours, setWorkingHours] = useState<WorkingHours>(initialRows);

  const updateWorkingHour = (index: number, field: keyof WorkingHoursRow, value: string) => {
    setWorkingHours((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addWorkingHour = () =>
    setWorkingHours((prev) => [...prev, { days: 'Weekdays', hours: '' }]);
  const removeWorkingHour = (index: number) => {
    setWorkingHours((prev) => {
      if (prev.length <= 1) return prev;
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  return (
    <div className="mb-4">
      <label className={styles.Label}>Working Hours</label>

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(workingHours.filter((wh) => wh.days && wh.hours.trim()))}
      />

      {workingHours.map((wh, index) => (
        <div key={index} className="row g-2 align-items-baseline mb-2">
          <div className="col-md-5">
            <Select
              name={`${name}[${index}].days`}
              options={dayOptions as unknown as GenericOption<string>[]}
              defaultValue={
                (dayOptions.find(
                  (opt) => opt.value === wh.days,
                ) as unknown as GenericOption<string>) ?? {
                  value: 'Weekdays',
                  label: 'Weekdays (Mon-Fri)',
                }
              }
              isMulti={false}
              onChange={(selected) => {
                const s = toSingle(
                  selected as GenericOption<string> | GenericOption<string>[] | null,
                );
                updateWorkingHour(index, 'days', s?.value || 'Weekdays');
              }}
              instanceId={`working-days-${index}`}
            />
          </div>

          <div className="col-md-6">
            <Input
              name={`${name}[${index}].hours`}
              placeholder="e.g. 9:00 AM - 5:00 PM"
              value={wh.hours}
              onChange={(e) => updateWorkingHour(index, 'hours', e.target.value)}
            />
          </div>

          <div className="col-md-1 d-flex justify-content-center align-items-center">
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => removeWorkingHour(index)}
              disabled={workingHours.length <= 1}
              aria-label="Remove working hours"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline-primary"
        size="small"
        onClick={addWorkingHour}
        className="mt-2"
      >
        <FaPlus className="me-1" /> Add Working Hours
      </Button>

      {error && <div className="text-danger small mt-2">{error}</div>}
    </div>
  );
};
