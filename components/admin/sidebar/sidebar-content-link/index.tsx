import Link from 'next/link';

type SidebarContentLinkProps = {
  href: string;
  label: string;
  newTabExternal?: boolean; // optional: open external links in a new tab
};

function isExternalUrl(href: string) {
  // http:, https:, mailto:, tel:, or protocol-relative //...
  return /^(?:[a-z][a-z0-9+.+-]*:|\/\/)/i.test(href);
}

export function SidebarContentLink({
  href,
  label,
  newTabExternal = true,
}: SidebarContentLinkProps) {
  const external = isExternalUrl(href);

  return (
    <li>
      {external ? (
        <a
          href={href}
          {...(newTabExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <i className="bi bi-circle"></i>
          <span>{label}</span>
        </a>
      ) : (
        <Link href={href}>
          <i className="bi bi-circle"></i>
          <span>{label}</span>
        </Link>
      )}
    </li>
  );
}
