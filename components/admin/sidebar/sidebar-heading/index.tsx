type SidebarHeadingProps = { children: React.ReactNode };

export function SidebarHeading({ children }: SidebarHeadingProps) {
  return <li className="nav-heading">{children}</li>;
}
