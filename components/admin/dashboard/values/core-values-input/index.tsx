'use client';

import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

import { Button } from '@/components/form-elements/button';
import { Input } from '@/components/form-elements/input';
import { FileDropzone } from '@/components/form-elements/image-dropzone';
import { IconPicker } from '@/components/icons/IconPicker';

import styles from './core-values-input.module.css';

import type { UploadedImageResponse } from '@/lib/types/cloudinary';

type ValueItem = {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  rank?: number;
};

type DefaultValueShape = {
  leadText?: string;
  values?: ValueItem[];
  coreValuesImage?: UploadedImageResponse | null;
};

type ErrorShape = {
  leadText?: string[];
  values?: Record<string, string[]>[];
  coreValuesImage?: string;
};

interface CoreValuesInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: DefaultValueShape;
  errors?: ErrorShape;
}

export const CoreValuesInput = ({
  name,
  label = 'Core Values',
  placeholder = "Describe your organization's core core-values philosophy...",
  defaultValue = { leadText: '', values: [], coreValuesImage: null },
  errors,
}: CoreValuesInputProps) => {
  const [leadText, setLeadText] = useState<string>(defaultValue.leadText ?? '');
  const [values, setValues] = useState<ValueItem[]>(defaultValue.values ?? []);
  const [newValue, setNewValue] = useState<Omit<ValueItem, 'id'>>({
    title: '',
    description: '',
    icon: null,
  });

  const updateValueAt = (index: number, patch: Partial<ValueItem>) => {
    setValues((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const removeValue = (id: string) => {
    setValues((prev) => prev.filter((v) => v.id !== id));
  };

  const addValue = () => {
    const title = newValue.title.trim();
    const description = newValue.description.trim();
    if (!title || !description) return;

    setValues((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        title,
        description,
        icon: newValue.icon ?? null,
      },
    ]);

    setNewValue({ title: '', description: '', icon: null });
  };

  const renderTopError = (error: string | Record<string, string[]>) => {
    if (typeof error === 'string') return error;
    return Object.entries(error)
      .map(
        ([key, messages]) => `${key}: ${Array.isArray(messages) ? messages.join(', ') : messages}`,
      )
      .join('; ');
  };

  const coreValuesJson = JSON.stringify(
    values.map((v, index) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      icon: v.icon ?? null,
      rank: v.rank ?? index + 1,
    })),
  );

  return (
    <div className="mb-4">
      <label className={styles.Label}>{label}</label>

      <div className={`${styles.CoreValuesSection} p-4 mb-4`}>
        <FileDropzone
          mode="image"
          folder="organizations/core-values"
          name="coreValuesImage"
          label="Core Values Header Image *"
          defaultValue={defaultValue.coreValuesImage ?? undefined}
          error={errors?.coreValuesImage}
          className="mb-4"
        />

        <div className="mb-4">
          <h4 className={styles.SectionTitle}>Core Values Introduction</h4>
          <Input
            name="coreValuesLeadText"
            as="textarea"
            value={leadText}
            onChange={(e) => setLeadText(e.target.value)}
            placeholder={placeholder}
            rows={3}
            error={errors?.leadText?.[0]}
          />
        </div>

        {values.length > 0 && (
          <div className="mb-4">
            <h4 className={styles.SectionTitle}>Current Core Values</h4>
            <div className={styles.ValuesList}>
              {values.map((value, idx) => (
                <div key={value.id} className={`${styles.ValueCard} mb-3 p-3`}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">{value.title || 'Untitled Value'}</h5>
                    <Button
                      type="button"
                      variant="text"
                      size="small"
                      className="text-danger p-0"
                      onClick={() => removeValue(value.id)}
                      aria-label="Remove value"
                    >
                      <FaTrash size={14} />
                    </Button>
                  </div>

                  {/* Title (add required name) */}
                  <div className="mb-2">
                    <Input
                      name={`cv-items-${idx}-title`} // <-- added name
                      label="Title"
                      value={value.title}
                      onChange={(e) => updateValueAt(idx, { title: e.target.value })}
                    />
                  </div>

                  {/* Description (add required name) */}
                  <div className="mb-2">
                    <Input
                      name={`cv-items-${idx}-description`} // <-- added name
                      label="Description"
                      as="textarea"
                      value={value.description}
                      rows={3}
                      onChange={(e) => updateValueAt(idx, { description: e.target.value })}
                    />
                  </div>

                  {/* Icon */}
                  <div className="mt-2">
                    <IconPicker
                      defaultIcon={value.icon ?? null}
                      onIconKeyChangeAction={(iconKey) => updateValueAt(idx, { icon: iconKey })}
                      hiddenFieldName={undefined}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden JSON payload for server */}
        <input type="hidden" name={name} value={coreValuesJson} />

        <div className={styles.AddValueForm}>
          <h4 className={styles.SectionTitle}>Add New Core Value</h4>

          <div className="mb-3">
            <Input
              label="Value Title"
              name="newValueTitle"
              value={newValue.title}
              onChange={(e) => setNewValue((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Teamwork"
            />
          </div>

          <div className="mb-3">
            <Input
              label="Value Description"
              as="textarea"
              name="newValueDescription"
              value={newValue.description}
              onChange={(e) => setNewValue((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this value means to your organization (2–3 sentences)"
              rows={3}
            />
          </div>

          <div className="mb-3">
            <IconPicker
              defaultIcon={newValue.icon ?? null}
              onIconKeyChangeAction={(iconKey) =>
                setNewValue((prev) => ({ ...prev, icon: iconKey }))
              }
              hiddenFieldName={undefined}
            />
          </div>

          <Button
            type="button"
            variant="primary"
            size="small"
            onClick={addValue}
            disabled={!newValue.title.trim() || !newValue.description.trim()}
            className="w-100"
          >
            <FaPlus className="me-2" />
            Add Core Value
          </Button>
        </div>
      </div>

      {errors?.values?.[0] && (
        <div className="text-danger small mt-2">{renderTopError(errors.values[0])}</div>
      )}
    </div>
  );
};
