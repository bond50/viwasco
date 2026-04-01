import React from 'react';

export type HeroTextMappingHelpRowProps = {
  kickerPreview: string;
  headingPreview: string;
  subheadingPreview: string;
};

export const HeroTextMappingHelpRow: React.FC<HeroTextMappingHelpRowProps> = ({
  kickerPreview,
  headingPreview,
  subheadingPreview,
}) => (
  <div className="mb-3">
    <button
      className="btn btn-sm btn-outline-secondary"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#heroTextMappingHelp"
      aria-expanded="false"
      aria-controls="heroTextMappingHelp"
    >
      Text mapping guide
    </button>
    <div className="collapse mt-2" id="heroTextMappingHelp">
      <div className="alert alert-light border small mb-0">
        <p className="mb-1">
          <span className="fw-semibold">Kicker (Tagline):</span> {kickerPreview}
        </p>
        <p className="mb-1">
          <span className="fw-semibold">Heading:</span> {headingPreview}
        </p>
        <p className="mb-1">
          <span className="fw-semibold">Subtitle:</span> {subheadingPreview}
        </p>
        <p className="mt-2 mb-0 text-muted">
          • <strong>Tagline</strong> comes from Basic / Identity.
          <br />• <strong>Heading</strong> and <strong>Subtitle</strong> come from Introduction.
        </p>
      </div>
    </div>
  </div>
);
