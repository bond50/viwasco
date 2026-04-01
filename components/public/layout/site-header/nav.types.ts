export type MenuNode = {
  label: string;
  href?: string;
  children?: MenuNode[];
  match?: { startsWith?: string[] };
  variant?: 'portal';
};
