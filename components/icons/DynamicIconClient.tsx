// components/icons/DynamicIconClient.tsx
'use client';

import * as React from 'react';
import type { IconType } from 'react-icons';
import ClipLoader from 'react-spinners/ClipLoader';
import type { IconPack } from '@/lib/icons/types';
import { parseIconKey } from '@/lib/icons/icon-key';
import { loadIconSmart } from '@/components/icons/icon-loaders';

type Props = {
  /** canonical "pack:IconName" e.g. "md:MdOutlineHandshake" */
  iconKey?: string | null;
  size?: number;
  className?: string;
  title?: string;
  /** Optional UI while loading / on error */
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
};

export function DynamicIconClient({
  iconKey,
  size = 20,
  className,
  title,
  loadingFallback,
  errorFallback = <span className="text-danger small">Icon error</span>,
}: Props) {
  const [Comp, setComp] = React.useState<IconType | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // If there's no key, don't render anything.

  React.useEffect(() => {
    let alive = true;
    setError(null);
    setComp(null);

    const parsed = parseIconKey(iconKey);
    if (!parsed) {
      setError('Invalid icon key');
      return () => {
        alive = false;
      };
    }

    loadIconSmart(parsed.pack as IconPack, parsed.name)
      .then((icon) => {
        if (!alive) return;
        if (!icon) {
          setError('Icon not found');
          return;
        }
        setComp(() => icon);
      })
      .catch(() => {
        if (!alive) return;
        setError('Failed to load icon');
      });

    return () => {
      alive = false;
    };
  }, [iconKey]);
  if (!iconKey) return null;
  // Default loading spinner (inherits text color)
  const defaultSpinner = (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 0 }}
    >
      <ClipLoader size={Math.max(12, Math.round(size * 0.85))} color="currentColor" />
    </span>
  );

  if (error) return <>{errorFallback}</>;
  if (!Comp) return <>{loadingFallback ?? defaultSpinner}</>;

  return <Comp size={size} className={className} title={title} />;
}
