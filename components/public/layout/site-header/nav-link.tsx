import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from '@/components/public/layout/site-header/navmenu.module.css';
import type { MenuNode } from '@/components/public/layout/site-header/nav.types';

type Props = {
  node: MenuNode;
  isActive: boolean;
  onClick?: () => void;
};

export function NavLink({ node, isActive, onClick }: Props) {
  const isPortal = node.variant === 'portal' && node.href;

  return (
    <Link
      href={node.href ?? '#'}
      className={cn(styles.navLink, isActive && styles.active, isPortal && styles.portalCta)}
      onClick={onClick}
      target={isPortal ? '_blank' : undefined}
      rel={isPortal ? 'noreferrer' : undefined}
    >
      {node.label}
    </Link>
  );
}
