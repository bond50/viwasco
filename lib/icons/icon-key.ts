import type { IconKey, IconPack } from './types';

export type ParsedIconKey = { pack: IconPack; name: string };

type PackMeta = {
  code: IconPack;
  label: string;
  license: 'MIT' | 'Apache-2.0' | 'CC0-1.0';
  homepage?: string;
};

export const ALLOWED_ICON_PACKS: ReadonlyArray<PackMeta> = [
  { code: 'ai', label: 'Ant Design Icons', license: 'MIT' },
  { code: 'bs', label: 'Bootstrap Icons', license: 'MIT' },
  { code: 'bi', label: 'BoxIcons', license: 'MIT' },
  { code: 'cg', label: 'CSS.gg', license: 'MIT' },
  { code: 'di', label: 'Devicons', license: 'MIT' },
  { code: 'fc', label: 'Flat Color Icons', license: 'MIT' },
  { code: 'fi', label: 'Feather', license: 'MIT' },
  { code: 'go', label: 'GitHub Octicons', license: 'MIT' },
  { code: 'gr', label: 'Grommet Icons', license: 'Apache-2.0' },
  { code: 'hi', label: 'Heroicons v1', license: 'MIT' },
  { code: 'hi2', label: 'Heroicons v2', license: 'MIT' },
  { code: 'io5', label: 'Ionicons v5', license: 'MIT' },
  { code: 'lia', label: 'Line Awesome', license: 'MIT' },
  { code: 'md', label: 'Material Design Icons', license: 'Apache-2.0' },
  { code: 'pi', label: 'Phosphor Icons', license: 'MIT' },
  { code: 'ri', label: 'Remix Icon', license: 'Apache-2.0' },
  { code: 'rx', label: 'Radix Icons', license: 'MIT' },
  { code: 'si', label: 'Simple Icons (brands)', license: 'CC0-1.0' },
  { code: 'sl', label: 'Simple Line Icons', license: 'MIT' },
  { code: 'tfi', label: 'Themify Icons', license: 'MIT' },
  { code: 'tb', label: 'Tabler Icons', license: 'MIT' },
] as const;

export const PACK_LABEL_BY_CODE: Readonly<Record<IconPack, string>> = ALLOWED_ICON_PACKS.reduce(
  (acc, p) => ({ ...acc, [p.code]: p.label }),
  {} as Record<IconPack, string>,
);

export const PACK_OPTIONS = ALLOWED_ICON_PACKS.map((p) => ({
  value: p.code,
  label: `${p.label} (${p.license})`,
}));

export function serializeIconKey(pack: IconPack, name: string): IconKey {
  return `${pack}:${name}` as IconKey;
}

/** Map common React-Icons name prefixes to ALLOWED packs */
const PREFIX_TO_PACK: Readonly<Record<string, IconPack>> = {
  Ai: 'ai',
  Bs: 'bs',
  Bi: 'bi',
  Cg: 'cg',
  Di: 'di',
  Fc: 'fc',
  Fi: 'fi',
  Go: 'go',
  Gr: 'gr',
  Hi: 'hi2', // prefer v2; loader cross-tries hi<->hi2 anyway
  Io: 'io5',
  Lia: 'lia',
  Md: 'md',
  Pi: 'pi',
  Ri: 'ri',
  Rx: 'rx',
  Si: 'si',
  Sl: 'sl',
  Tfi: 'tfi',
  Tb: 'tb',
};

/** Disallowed prefixes (still blocked) */
const DISALLOWED_PREFIX: Readonly<Record<string, { label: string; reason: string }>> = {
  Fa: { label: 'Font Awesome', reason: 'license restrictions for certain uses' },
  Fa6: { label: 'Font Awesome 6', reason: 'license restrictions for certain uses' },
  Ti: { label: 'Typicons', reason: 'license requires attribution/share-alike' },
  Gi: { label: 'Game Icons', reason: 'license requires attribution' },
  Im: { label: 'IcoMoon', reason: 'license/attribution restrictions' },
  Vsc: { label: 'VS Code Icons', reason: 'not in allowed list' },
  Wi: { label: 'Weather Icons', reason: 'not in allowed list' },
  Lu: { label: 'Lucide', reason: 'not in allowed list' },
};

export function allowedLibrariesList(): string {
  return ALLOWED_ICON_PACKS.map((p) => p.label).join(', ');
}

/** If a name obviously comes from a disallowed library, return a human messages */
export function explainIfDisallowedIconName(name?: string | null): string | null {
  if (!name) return null;
  const m = /^([A-Z][a-z0-9]*)/.exec(name.trim());
  if (!m) return null;
  const meta = DISALLOWED_PREFIX[m[1]];
  if (!meta) return null;
  return `Icons with prefix "${m[1]}" (${meta.label}) aren’t allowed here due to ${meta.reason}. Allowed libraries: ${allowedLibrariesList()}.`;
}

/** Guess the correct ALLOWED pack from an icon name’s PascalCase prefix */
export function guessPackFromIconName(name?: string | null): IconPack | null {
  if (!name) return null;
  const m = /^([A-Z][a-z0-9]*)/.exec(name.trim());
  if (!m) return null;
  return (PREFIX_TO_PACK[m[1]] ?? null) as IconPack | null;
}

/** Parse "pack:Name" — returns null if format/pack invalid.
 * If the name suggests a different allowed pack, prefer that. */
export function parseIconKey(key?: string | null): ParsedIconKey | null {
  if (!key) return null;
  const idx = key.indexOf(':');
  if (idx <= 0) return null;
  const pack = key.slice(0, idx) as IconPack;
  const meta = ALLOWED_ICON_PACKS.find((p) => p.code === pack);
  if (!meta) return null;
  const name = key.slice(idx + 1).trim();
  if (!name) return null;

  const guessed = guessPackFromIconName(name);
  if (guessed && guessed !== pack) return { pack: guessed, name };
  return { pack, name };
}

/** Validation: format + allowed pack; also blocks disallowed prefixes explicitly. */
export function validateIconKey(key: string | null): { ok: true } | { ok: false; error: string } {
  if (!key || !key.trim()) return { ok: true };

  const idx = key.indexOf(':');
  const nameOnly = idx >= 0 ? key.slice(idx + 1) : key;
  const disallowed = explainIfDisallowedIconName(nameOnly);
  if (disallowed) return { ok: false, error: disallowed };

  const parsed = parseIconKey(key);
  if (!parsed) {
    return {
      ok: false,
      error: `Invalid icon key or library. Allowed libraries: ${allowedLibrariesList()}. Use "pack:IconName" e.g. "tb:TbPlant2".`,
    };
  }
  return { ok: true };
}
