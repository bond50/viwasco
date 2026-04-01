'use client';

import * as React from 'react';
import type { IconPack } from '@/lib/icons/types';
import {
  explainIfDisallowedIconName,
  guessPackFromIconName,
  PACK_LABEL_BY_CODE,
  PACK_OPTIONS,
  parseIconKey,
  serializeIconKey,
  validateIconKey,
} from '@/lib/icons/icon-key';
import { Input } from '@/components/form-elements/input';
import { Select } from '@/components/form-elements/select';
import { DynamicIconClient } from '@/components/icons/DynamicIconClient';

type Props = {
  /** Incoming canonical key like "tb:TbPlant2" */
  defaultIcon?: string | null;
  /**
   * Optional client callback (named with `Action` to keep Next happy).
   * Fires with canonical iconKey or null (when invalid/disallowed).
   */
  onIconKeyChangeAction?: (iconKey: string | null) => void;
  /** Optional: form field name for the hidden input (defaults to "icon") */
  hiddenFieldName?: string;
};

const REACT_ICONS_URL =
  process.env.NEXT_PUBLIC_REACT_ICONS_URL || 'https://react-icons.github.io/react-icons/';

export function IconPicker({
  defaultIcon,
  onIconKeyChangeAction,
  hiddenFieldName = 'icon',
}: Props) {
  const parsed = parseIconKey(defaultIcon ?? undefined);

  // User-controlled state
  const [pack, setPack] = React.useState<IconPack>(parsed?.pack ?? 'tb');
  const [name, setName] = React.useState<string>(parsed?.name ?? 'TbPlant2');

  // Detect disallowed libraries by name prefix (Fa, Fa6, …)
  const disallowedMsg = explainIfDisallowedIconName(name);
  const isDisallowed = !!disallowedMsg;

  // Guess allowed pack from name if possible; otherwise use user-selected pack
  const guessed = guessPackFromIconName(name);
  const effectivePack = guessed ?? pack;

  // Only build a key if not disallowed
  const iconKey = !isDisallowed && name ? serializeIconKey(effectivePack, name) : null;

  const [hint, setHint] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isDisallowed) {
      setHint(disallowedMsg!);
      onIconKeyChangeAction?.(null); // don’t submit a blocked icon
      return;
    }
    onIconKeyChangeAction?.(iconKey);
    const v = validateIconKey(iconKey);
    setHint(v.ok ? null : v.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisallowed, disallowedMsg, effectivePack, name]);

  // For rendering nice “allowed library” pills
  const allowedOptions = PACK_OPTIONS as Array<{ value: IconPack; label: string }>;

  return (
    <>
      <div className="d-flex align-items-start gap-2">
        <div style={{ minWidth: 240 }}>
          <Select
            name="icon-pack-view"
            label="Icon Library"
            options={allowedOptions}
            value={{ value: effectivePack, label: `${PACK_LABEL_BY_CODE[effectivePack]}` }}
            onChange={(opt) => setPack((opt?.value as IconPack) || 'tb')}
          />
        </div>

        <div className="flex-grow-1">
          <Input
            name="icon-name-view"
            label="Icon Name"
            placeholder="e.g., TbPlant2 or AiOutlineHome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="d-flex flex-column align-items-center" style={{ minWidth: 64 }}>
          <label className="form-label mb-1">Preview</label>
          <div
            className={`border rounded p-2 d-flex align-items-center justify-content-center ${
              isDisallowed ? 'bg-light' : ''
            }`}
            style={{ width: 48, height: 48 }}
          >
            {isDisallowed ? (
              <span className="text-danger small" title="This icon library is not allowed">
                ✖
              </span>
            ) : (
              <DynamicIconClient iconKey={iconKey ?? undefined} size={24} />
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="mt-2" aria-live="polite">
        {hint ? (
          // Error / warning in a compact alert
          <div className="alert alert-danger py-2 px-3 mb-2 small" role="alert">
            {hint}
          </div>
        ) : (
          // Friendly guidance and allowed libraries
          <>
            <div className="d-flex flex-wrap align-items-center gap-2 small text-muted">
              <span>
                Need icons? Browse the free{' '}
                <a href={REACT_ICONS_URL} target="_blank" rel="noreferrer">
                  React Icons gallery
                </a>
                .
              </span>
            </div>

            {/* Nicely formatted allowed libraries */}
            <div className="mt-2">
              <details>
                <summary className="small text-muted" style={{ cursor: 'pointer' }}>
                  View allowed libraries ({allowedOptions.length})
                </summary>
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {allowedOptions.map((opt) => (
                    <span
                      key={opt.value}
                      className="badge bg-light text-dark border"
                      title={opt.label}
                      style={{ fontWeight: 500 }}
                    >
                      <code className="me-1">{opt.value.toUpperCase()}</code>
                      {opt.label}
                    </span>
                  ))}
                </div>
              </details>
            </div>
          </>
        )}
      </div>

      {/* Canonical field actually submitted to the server (empty if disallowed) */}
      <input type="hidden" name={hiddenFieldName} value={iconKey ?? ''} />
    </>
  );
}
