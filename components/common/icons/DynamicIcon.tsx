import React from 'react';
import type { IconPack } from '@/lib/icons/types';
import { parseIconKey } from '@/lib/icons/icon-key';
import { loadIconSmart } from '@/components/icons/icon-loaders';

type IconLikeProps = { size?: number; className?: string; title?: string };

type Props = {
  iconKey?: string | null;
  size?: number;
  className?: string;
  title?: string;
  fallback?: React.ReactNode;
};

export async function DynamicIcon({
  iconKey,
  size = 20,
  className,
  title,
  fallback = null,
}: Props) {
  const renderFallback = () => {
    if (!fallback) return null;
    if (!React.isValidElement(fallback)) return <>{fallback}</>;

    // If it's a DOM element (e.g., 'span'), don't inject `size`
    if (typeof fallback.type === 'string') {
      return React.cloneElement(
        fallback as React.ReactElement<Pick<IconLikeProps, 'className' | 'title'>>,
        { className, title },
      );
    }

    // It's a component (e.g., from react-icons) – safe to pass `size`
    return React.cloneElement(fallback as React.ReactElement<IconLikeProps>, {
      size,
      className,
      title,
    });
  };

  if (!iconKey) return renderFallback();

  const parsed = parseIconKey(iconKey);
  if (!parsed) return renderFallback();

  // Load icon in try/catch, but DO NOT construct JSX inside try/catch
  let Comp: React.ComponentType<IconLikeProps> | null = null;
  try {
    const Loaded = await loadIconSmart(parsed.pack as IconPack, parsed.name);
    if (Loaded) Comp = Loaded;
  } catch {
    /* swallow and fall back below */
  }

  if (!Comp) return renderFallback();
  return <Comp size={size} className={className} title={title} />;
}
