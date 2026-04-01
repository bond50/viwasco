import React from 'react';

export type HeroTypeRowProps = {
  desktopUseVideo: boolean;
  mobileUseVideo: boolean;
  onChangeDesktop: (useVideo: boolean) => void;
  onChangeMobile: (useVideo: boolean) => void;
};

export const HeroTypeRow: React.FC<HeroTypeRowProps> = ({
  desktopUseVideo,
  mobileUseVideo,
  onChangeDesktop,
  onChangeMobile,
}) => (
  <div className="row mb-3">
    <label className="col-sm-3 col-form-label">Hero type</label>
    <div className="col-sm-9">
      {/* Desktop */}
      <div className="mb-2">
        <div className="fw-semibold small mb-1">Desktop</div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="desktopHeroType"
            id="desktopHeroTypeImage"
            checked={!desktopUseVideo}
            onChange={() => onChangeDesktop(false)}
          />
          <label className="form-check-label" htmlFor="desktopHeroTypeImage">
            Image hero
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="desktopHeroType"
            id="desktopHeroTypeVideo"
            checked={desktopUseVideo}
            onChange={() => onChangeDesktop(true)}
          />
          <label className="form-check-label" htmlFor="desktopHeroTypeVideo">
            Video hero
          </label>
        </div>
      </div>

      {/* Mobile */}
      <div>
        <div className="fw-semibold small mb-1">Mobile</div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="mobileHeroType"
            id="mobileHeroTypeImage"
            checked={!mobileUseVideo}
            onChange={() => onChangeMobile(false)}
          />
          <label className="form-check-label" htmlFor="mobileHeroTypeImage">
            Image hero
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="mobileHeroType"
            id="mobileHeroTypeVideo"
            checked={mobileUseVideo}
            onChange={() => onChangeMobile(true)}
          />
          <label className="form-check-label" htmlFor="mobileHeroTypeVideo">
            Video hero
          </label>
        </div>
      </div>

      {/* Hidden checkboxes to submit booleans */}
      <input
        type="checkbox"
        name="desktopUseVideo"
        className="d-none"
        checked={desktopUseVideo}
        readOnly
      />
      <input
        type="checkbox"
        name="mobileUseVideo"
        className="d-none"
        checked={mobileUseVideo}
        readOnly
      />

      <div className="form-text mt-2">
        Choose image or video hero independently for desktop and mobile.
      </div>
    </div>
  </div>
);
