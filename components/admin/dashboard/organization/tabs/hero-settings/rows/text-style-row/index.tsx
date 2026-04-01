import React from 'react';
import type { OrganizationHeroValues } from '@/lib/schemas/about/organization/hero';

type AlignValue = NonNullable<OrganizationHeroValues['desktopTextAlign']>;
type ChromeValue = NonNullable<OrganizationHeroValues['desktopTextChrome']>;

const ALIGN_OPTIONS: ReadonlyArray<{ value: AlignValue; label: string }> = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
];

const CHROME_OPTIONS: ReadonlyArray<{ value: ChromeValue; label: string }> = [
  { value: 'plain', label: 'Plain' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'boxed', label: 'Boxed glass' },
  { value: 'shadow', label: 'Strong shadow' },
];

export type HeroTextStyleRowProps = {
  desktopAlignDefault: AlignValue;
  desktopChromeDefault: ChromeValue;
  mobileAlignDefault: AlignValue;
  mobileChromeDefault: ChromeValue;
};

export const HeroTextStyleRow: React.FC<HeroTextStyleRowProps> = ({
  desktopAlignDefault,
  desktopChromeDefault,
  mobileAlignDefault,
  mobileChromeDefault,
}) => {
  const tooltipText = 'Control how hero text is aligned and styled on each device.';

  return (
    <div className="row mb-3">
      <label className="col-sm-3 col-form-label">
        Text layout
        <span className="ms-1 text-muted" title={tooltipText} aria-label={tooltipText}>
          <i className="bi bi-info-circle" aria-hidden="true" />
        </span>
      </label>
      <div className="col-sm-9">
        {/* Desktop settings */}
        <div className="mb-2">
          <div className="fw-semibold small mb-1">Desktop</div>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label form-label-sm">Alignment</label>
              <select
                className="form-select form-select-sm"
                name="desktopTextAlign"
                defaultValue={desktopAlignDefault}
              >
                {ALIGN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label form-label-sm">Chrome</label>
              <select
                className="form-select form-select-sm"
                name="desktopTextChrome"
                defaultValue={desktopChromeDefault}
              >
                {CHROME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile settings */}
        <div>
          <div className="fw-semibold small mb-1">Mobile</div>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label form-label-sm">Alignment</label>
              <select
                className="form-select form-select-sm"
                name="mobileTextAlign"
                defaultValue={mobileAlignDefault}
              >
                {ALIGN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label form-label-sm">Chrome</label>
              <select
                className="form-select form-select-sm"
                name="mobileTextChrome"
                defaultValue={mobileChromeDefault}
              >
                {CHROME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-text mt-2">
          You can mix and match per device (e.g. left + shadow on desktop, centered + liquid on
          mobile).
        </div>
      </div>
    </div>
  );
};
