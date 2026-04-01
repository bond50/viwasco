import React from 'react';

export type HeroDevicesRowProps = {
  desktopShowDefault: boolean;
  mobileShowDefault: boolean;
};

export const HeroDevicesRow: React.FC<HeroDevicesRowProps> = ({
  desktopShowDefault,
  mobileShowDefault,
}) => (
  <div className="row mb-3">
    <label className="col-sm-3 col-form-label">Devices</label>
    <div className="col-sm-9">
      <div className="row">
        <div className="col-6">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="desktopShow"
              name="desktopShow"
              defaultChecked={desktopShowDefault}
            />
            <label className="form-check-label" htmlFor="desktopShow">
              Show on desktop
            </label>
          </div>
        </div>
        <div className="col-6">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="mobileShow"
              name="mobileShow"
              defaultChecked={mobileShowDefault}
            />
            <label className="form-check-label" htmlFor="mobileShow">
              Show on mobile
            </label>
          </div>
        </div>
      </div>
      <div className="form-text">You can hide the hero on a specific device type if needed.</div>
    </div>
  </div>
);
