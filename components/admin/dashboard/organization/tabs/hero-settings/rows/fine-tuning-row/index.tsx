import React from 'react';

export type HeroFineTuningRowProps = {
  desktopScrollCueDefault: boolean;
  mobileScrollCueDefault: boolean;
  desktopOverlayDefault: 'none' | 'soft' | 'medium' | 'strong';
  mobileOverlayDefault: 'none' | 'soft' | 'medium' | 'strong';
};

const OVERLAY_OPTIONS: ReadonlyArray<{
  value: 'none' | 'soft' | 'medium' | 'strong';
  label: string;
}> = [
  { value: 'none', label: 'None' },
  { value: 'soft', label: 'Soft' },
  { value: 'medium', label: 'Medium' },
  { value: 'strong', label: 'Strong' },
];

export const HeroFineTuningRow: React.FC<HeroFineTuningRowProps> = ({
  desktopScrollCueDefault,
  mobileScrollCueDefault,
  desktopOverlayDefault,
  mobileOverlayDefault,
}) => (
  <div className="row mb-3">
    <label className="col-sm-3 col-form-label">Fine-tuning</label>
    <div className="col-sm-9">
      {/* Desktop */}
      <div className="mb-2">
        <div className="fw-semibold small mb-1">Desktop</div>
        <div className="form-check mb-1">
          <input
            className="form-check-input"
            type="checkbox"
            id="desktopShowScrollCue"
            name="desktopShowScrollCue"
            defaultChecked={desktopScrollCueDefault}
          />
          <label className="form-check-label" htmlFor="desktopShowScrollCue">
            Show scroll cue arrow
          </label>
        </div>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <label className="form-label form-label-sm mb-0" htmlFor="desktopOverlayStrength">
              Overlay strength
            </label>
          </div>
          <div className="col">
            <select
              className="form-select form-select-sm"
              id="desktopOverlayStrength"
              name="desktopOverlayStrength"
              defaultValue={desktopOverlayDefault}
            >
              {OVERLAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div>
        <div className="fw-semibold small mb-1">Mobile</div>
        <div className="form-check mb-1">
          <input
            className="form-check-input"
            type="checkbox"
            id="mobileShowScrollCue"
            name="mobileShowScrollCue"
            defaultChecked={mobileScrollCueDefault}
          />
          <label className="form-check-label" htmlFor="mobileShowScrollCue">
            Show scroll cue arrow
          </label>
        </div>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <label className="form-label form-label-sm mb-0" htmlFor="mobileOverlayStrength">
              Overlay strength
            </label>
          </div>
          <div className="col">
            <select
              className="form-select form-select-sm"
              id="mobileOverlayStrength"
              name="mobileOverlayStrength"
              defaultValue={mobileOverlayDefault}
            >
              {OVERLAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-text mt-2">
        For example, use a stronger overlay on desktop for contrast and a softer one on mobile.
      </div>
    </div>
  </div>
);
