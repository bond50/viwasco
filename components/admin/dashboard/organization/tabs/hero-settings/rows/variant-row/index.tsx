import React from 'react';
import type { OrganizationHeroValues } from '@/lib/schemas/about/organization/hero';

type VariantValue = OrganizationHeroValues['variant'];

const VARIANTS: ReadonlyArray<{ value: VariantValue; label: string }> = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal (recommended)' },
  { value: 'tall', label: 'Tall' },
  { value: 'full', label: 'Full (100vh)' },
];

export type HeroVariantRowProps = {
  variantDefault: VariantValue;
  getError: (field: keyof OrganizationHeroValues) => string | undefined;
};

export const HeroVariantRow: React.FC<HeroVariantRowProps> = ({ variantDefault, getError }) => {
  const error = getError('variant');
  const tooltipText =
    'Controls how tall the hero appears on larger screens (desktop / tablet). Mobile uses a natural height.';

  return (
    <div className="row mb-3">
      <label className="col-sm-3 col-form-label">
        Height (desktop layout)
        <span className="ms-1 text-muted" title={tooltipText} aria-label={tooltipText}>
          <i className="bi bi-info-circle" aria-hidden="true" />
        </span>
      </label>
      <div className="col-sm-9">
        <select className="form-select" name="variant" defaultValue={variantDefault}>
          {VARIANTS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <div className="invalid-feedback d-block">{error}</div>}
        <div className="form-text">
          This setting targets desktop / larger viewports. Mobile will remain naturally sized and
          rely on its own text / overlay options.
        </div>
      </div>
    </div>
  );
};
