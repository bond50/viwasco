'use client';

import { useState } from 'react';
import { Input } from '@/components/form-elements/input';
import { Button } from '@/components/form-elements/button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import box from './schedule-input.module.css';

export type ScheduleItem = {
  timeLabel: string;
  title: string;
  description?: string;
};

type Props = {
  name?: string;
  label?: string;
  defaultValue?: ScheduleItem[] | null;
  errors?: Record<string, string[]>;
};

export function ScheduleInput({
  name = 'schedule',
  label = 'Schedule',
  defaultValue = [],
  errors,
}: Props) {
  const [items, setItems] = useState<ScheduleItem[]>(
    (defaultValue ?? []).map((it) => ({
      timeLabel: it?.timeLabel ?? '',
      title: it?.title ?? '',
      description: it?.description ?? '',
    })),
  );

  const update = <K extends keyof ScheduleItem>(idx: number, key: K, value: ScheduleItem[K]) => {
    const next = [...items];
    next[idx] = { ...next[idx], [key]: value };
    setItems(next);
  };

  const add = () => setItems([...items, { timeLabel: '', title: '', description: '' }]);
  const remove = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  // Filter empty rows before posting
  const payload = items
    .map((it) => ({
      timeLabel: (it.timeLabel ?? '').trim(),
      title: (it.title ?? '').trim(),
      description: (it.description ?? '').trim(),
    }))
    .filter((it) => it.timeLabel || it.title || it.description);

  return (
    <div className={box.Container}>
      <label className={box.Label}>{label}</label>

      {/* Hidden JSON payload */}
      <input type="hidden" name={name} value={JSON.stringify(payload)} />

      <div className={box.List}>
        {items.map((it, idx) => (
          <div key={idx} className={box.Item}>
            <div className={box.Grid}>
              <Input
                name={`${name}[${idx}].timeLabel`}
                label="Time"
                placeholder="e.g., 3:00 PM - 3:30 PM"
                value={it.timeLabel}
                onChange={(e) => update(idx, 'timeLabel', e.target.value)}
                error={errors?.[`${name}.${idx}.timeLabel`]?.[0]}
              />
              <Input
                name={`${name}[${idx}].title`}
                label="Title"
                placeholder="Opening Remarks"
                value={it.title}
                onChange={(e) => update(idx, 'title', e.target.value)}
                error={errors?.[`${name}.${idx}.title`]?.[0]}
              />
              <Input
                name={`${name}[${idx}].description`}
                label="Description"
                placeholder="Welcome note"
                value={it.description ?? ''}
                onChange={(e) => update(idx, 'description', e.target.value)}
                error={errors?.[`${name}.${idx}.description`]?.[0]}
              />
              <div className={box.RemoveCol}>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => remove(idx)}
                  aria-label="Remove schedule item"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline-primary"
        size="small"
        onClick={add}
        className={box.AddBtn}
      >
        <FaPlus className="me-1" /> Add Schedule Item
      </Button>

      {errors?.[name]?.[0] && <div className="text-danger small mt-2">{errors[name][0]}</div>}
    </div>
  );
}
