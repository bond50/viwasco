'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RxCross1, RxHamburgerMenu } from 'react-icons/rx';
import { BiChevronDown } from 'react-icons/bi';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import s from './navmenu.module.css';
import { NavLink } from './nav-link';

import type { MenuNode } from './nav.types';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { isActiveHref, makeId, nodeActive } from '@/components/public/layout/site-header/nav-helpers';

type Props = {
    tree: MenuNode[];
    logoSrc: string;
};

export function NavMenu({tree, logoSrc}: Props) {
    const pathname = usePathname();
    const isDesktop = useMediaQuery('(min-width: 1200px)'); // matches your desktop behavior

    const [mobileOpen, setMobileOpen] = useState(false);
    const [openIds, setOpenIds] = useState<Set<string>>(new Set());

    // Close with ESC only when mobile panel is open
    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [mobileOpen]);

    const toggleOpen = (id: string) =>
        setOpenIds((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });

    const closeAll = () => {
        setMobileOpen(false);
        setOpenIds(new Set());
    };

    const renderNode = (
        node: MenuNode,
        idPath: string[] = [],
        isMobile = false,
    ): React.JSX.Element | null => {
        const hasChildren = !!node.children?.length;
        const id = makeId([...idPath, node.label]);
        const active = nodeActive(pathname, node);

        // Leaf
        if (!hasChildren) {
            if (!node.href) return null;
            return (
                <li key={id}>
                    <NavLink
                        node={node}
                        isActive={isActiveHref(pathname, node.href)}
                        onClick={isMobile ? closeAll : undefined}
                    />
                </li>
            );
        }

        // Parent
        const openOnMobile = isMobile && openIds.has(id);

        return (
            <li key={id} className={s.dropdown}>
                <a
                    href="#"
                    className={cn(active && s.active)}
                    onClick={(e) => {
                        // Desktop relies on CSS hover; only toggle on mobile widths
                        if (isDesktop) return;
                        e.preventDefault();
                        toggleOpen(id);
                    }}
                    aria-expanded={isMobile ? openOnMobile : undefined}
                    aria-controls={isMobile ? `sub-${id}` : undefined}
                >
                    <span>{node.label}</span>
                    <span className={s.toggler} aria-hidden="true">
            <BiChevronDown/>
          </span>
                </a>

                <ul
                    id={isMobile ? `sub-${id}` : undefined}
                    className={cn(isMobile && s.mobileSub, openOnMobile && s.dropdownActive)}
                >
                    {node.children!.map((child) => renderNode(child, [...idPath, node.label], isMobile))}
                </ul>
            </li>
        );
    };

    // Key by pathname so the nav remounts on route change -> state is reset
    return (
        <nav key={pathname} className={s.navmenu} aria-label="Primary">
            {/* Desktop */}
            <div className={s.desktopBar}>
                <ul className={s.list}>{tree.map((n) => renderNode(n, [], false))}</ul>
            </div>

            {/* Mobile toggle (inline, no portal) */}
            <div className={cn(s.onlyMobileCenterFallback, mobileOpen && s.toggleLauncherHidden)}>
                <button
                    type="button"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    aria-pressed={mobileOpen}
                    data-open={mobileOpen}
                    className={cn(s.barToggle, mobileOpen && s.toggleActive)}
                    onClick={() => {
                        setMobileOpen((v) => !v);
                        if (mobileOpen) setOpenIds(new Set());
                    }}
                >
          <span className={cn(s.icon, s.iconHamb, mobileOpen && s.iconHidden)}>
            <RxHamburgerMenu/>
          </span>
                    <span className={cn(s.icon, s.iconClose, !mobileOpen && s.iconHidden)}>
            <RxCross1/>
          </span>
                </button>
            </div>

            {/* Mobile panel */}
            <div
                className={cn(s.dropSheet, s.onlyMobile, mobileOpen && s.open)}
                aria-hidden={!mobileOpen}
                role="dialog"
                aria-modal="true"
            >
                <div className={s.backdrop} onClick={closeAll}/>
                <aside className={s.dropPanel}>
                    <div className={s.drawerHeader}>
                        <Link href="/" className={s.drawerBrand} onClick={closeAll} aria-label="Go to homepage">
                            <Image
                                src={logoSrc}
                                alt="Viwasco Logo"
                                width={505}
                                height={494}
                                className={s.drawerLogo}
                            />
                            <span className={s.drawerBrandText}>VIWASCO</span>
                        </Link>

                        <button
                            type="button"
                            aria-label="Close menu"
                            className={cn(s.barToggle, s.drawerClose)}
                            onClick={closeAll}
                        >
                            <span className={s.icon}>
                                <RxCross1/>
                            </span>
                        </button>
                    </div>
                    <ul className={s.mobileList}>{tree.map((n) => renderNode(n, [], true))}</ul>
                </aside>
            </div>
        </nav>
    );
}

export default NavMenu;
