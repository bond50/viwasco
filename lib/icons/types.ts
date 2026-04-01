/** Packs we allow: permissive (MIT / Apache-2.0 / CC0) and easy to use without attribution. */
export type IconPack =
  | 'ai' // Ant Design Icons — MIT
  | 'bs' // Bootstrap Icons — MIT
  | 'bi' // BoxIcons — MIT
  | 'cg' // CSS.gg — MIT
  | 'di' // Devicons — MIT
  | 'fc' // Flat Color Icons — MIT
  | 'fi' // Feather — MIT
  | 'go' // GitHub Octicons — MIT
  | 'gr' // Grommet Icons — Apache-2.0
  | 'hi' // Heroicons v1 — MIT
  | 'hi2' // Heroicons v2 — MIT
  | 'io5' // Ionicons v5 — MIT
  | 'lia' // Line Awesome — MIT
  | 'md' // Material Design Icons — Apache-2.0
  | 'pi' // Phosphor — MIT
  | 'ri' // Remix Icon — Apache-2.0
  | 'rx' // Radix Icons — MIT
  | 'si' // Simple Icons (brands) — CC0-1.0
  | 'sl' // Simple Line Icons — MIT
  | 'tfi' // Themify Icons — MIT
  | 'tb'; // Tabler Icons — MIT

/** Canonical “pack:IconName” string, e.g. "tb:TbPlant2" */
export type IconKey = `${IconPack}:${string}`;
