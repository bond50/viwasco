import React from 'react';

export type HeroVisibilityRowProps = {
  enabled: boolean;
  onChange: (value: boolean) => void;
};

export const HeroVisibilityRow: React.FC<HeroVisibilityRowProps> = ({ enabled, onChange }) => (
  <div className="row mb-3">
    <label className="col-sm-3 col-form-label">Visibility</label>
    <div className="col-sm-9">
      <div className="form-check form-switch mb-1">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="heroEnabled"
          name="enabled"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="heroEnabled">
          {enabled ? 'Hero enabled' : 'Hero disabled'}
        </label>
      </div>
      <div className="form-text">
        Turn this off to hide the hero completely on the public site. When off, other options are
        locked (but your previous choices are kept).
      </div>
    </div>
  </div>
);
