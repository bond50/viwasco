'use client';

import { useState } from 'react';
import { Input } from '@/components/form-elements/input';
import { Button } from '@/components/form-elements/button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import box from './highlights-input.module.css';

type Props = {
  name?: string;
  label?: string;
  defaultValue?: string[] | null;
  errors?: Record<string, string[]>;
};

export function HighlightsInput({
  name = 'highlights',
  label = 'Highlights',
  defaultValue = [],
  errors,
}: Props) {
  const [items, setItems] = useState<string[]>(
    (defaultValue ?? []).filter((s): s is string => typeof s === 'string'),
  );

  const update = (idx: number, value: string) => {
    const next = [...items];
    next[idx] = value;
    setItems(next);
  };

  const add = () => setItems([...items, '']);
  const remove = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const payload = items.filter((s) => s.trim().length > 0);

  return (
    <div className={box.Container}>
      <label className={box.Label}>{label}</label>

      {/* Hidden JSON payload */}
      <input type="hidden" name={name} value={JSON.stringify(payload)} />

      <div className={box.List}>
        {items.map((val, idx) => (
          <div key={idx} className={box.Row}>
            <div className={box.Field}>
              <Input
                name={`${name}[${idx}]`}
                placeholder={`Highlight ${idx + 1}`}
                value={val}
                onChange={(e) => update(idx, e.target.value)}
                error={errors?.[`${name}.${idx}`]?.[0]}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => remove(idx)}
              aria-label="Remove highlight"
              className={box.IconBtn}
            >
              <FaTrash />
            </Button>
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
        <FaPlus className="me-1" /> Add Highlight
      </Button>

      {errors?.[name]?.[0] && <div className="text-danger small mt-2">{errors[name][0]}</div>}
    </div>
  );
}
