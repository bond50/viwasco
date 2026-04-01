// components/form-elements/excerpt-controls.tsx
'use client';

import * as React from 'react';
import { Switch } from '@/components/form-elements/switch';
import { Input } from '@/components/form-elements/input';

type ExcerptControlsProps = {
  name?: string; // hidden input name (defaults to 'excerpt')
  error?: string;

  // core-values
  excerpt: string; // manual value (from hook/state)
  generated: string; // auto-generated (from body)
  autoFill: boolean; // true => follow body, false => manual

  // actions (TS71007-safe prop names)
  setExcerptAction: (v: string) => void;
  toggleAutoFillAction: (val?: boolean) => void;
};

export function ExcerptControls({
  name = 'excerpt',
  error,
  excerpt,
  generated,
  autoFill,
  setExcerptAction,
  toggleAutoFillAction,
}: ExcerptControlsProps) {
  // When turning autoFill OFF, seed manual excerpt with current preview.
  const handleToggle = (checked: boolean) => {
    if (!checked) {
      // switching OFF auto-fill → copy preview into editable field (if empty or different)
      setExcerptAction(generated || '');
    }
    toggleAutoFillAction(checked);
  };

  // Hidden input: submit generated when auto, else manual
  const submittedValue = autoFill ? generated : excerpt;

  return (
    <>
      <input type="hidden" name={name} value={submittedValue} />

      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="small text-muted">
          <strong>Excerpt</strong> (used in listings & SEO)
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="small me-2">Auto‑fill from body</span>
          <Switch
            name="__excerpt_autofill"
            label=""
            defaultChecked={autoFill}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToggle(e.target.checked)}
          />
        </div>
      </div>

      {autoFill ? (
        // Auto mode → preview only
        <div
          className="mb-2 p-2 rounded border small"
          style={{
            borderColor: 'color-mix(in srgb, var(--default-color), transparent 85%)',
            background: 'color-mix(in srgb, var(--surface-color), white 2%)',
          }}
        >
          {generated || <span className="text-muted">No preview yet… start typing above.</span>}
        </div>
      ) : (
        // Manual mode → editable textarea
        <Input
          as="textarea"
          name="__excerpt_editable" // visual-only; submitted via hidden input above
          label="Excerpt (manual)"
          className="mb-2"
          value={excerpt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExcerptAction(e.target.value)}
          error={error}
        />
      )}

      <div className="small text-muted">
        {autoFill
          ? 'Following the body content. Turn off to edit manually.'
          : 'Manual excerpt active. Turn on auto‑fill to follow the body again.'}
      </div>
    </>
  );
}
