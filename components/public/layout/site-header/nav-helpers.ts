import type { MenuNode } from './nav.types';

/* ---------- tiny utils ---------- */
export function makeId(parts: string[]): string {
    return parts.join('__').toLowerCase().replace(/\s+/g, '-');
}

export function pruneInvalidLeaves(nodes: MenuNode[]): MenuNode[] {
    return nodes
        .map((n) => ({
            ...n,
            children: n.children ? pruneInvalidLeaves(n.children) : undefined,
        }))
        .filter((n) => n.href || (n.children && n.children.length > 0));
}

export function isActiveHref(pathname: string, href?: string): boolean {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
}

export function nodeActive(pathname: string, node: MenuNode): boolean {
    if (node.href && isActiveHref(pathname, node.href)) return true;
    const sw = node.match?.startsWith ?? [];
    return sw.some((s) => pathname.startsWith(s));
}

/* ---------- normalize (About-only in v1) ---------- */
function replaceOrAppendRoot(out: MenuNode[], node: MenuNode) {
    const idx = out.findIndex(
        (n) => n.label.toLowerCase() === node.label.toLowerCase(),
    );
    if (idx >= 0) out[idx] = node;
    else out.push(node);
}

export function normalizeNav(
    base: MenuNode[],
    dynamic: Partial<{
        about: MenuNode;
        services: MenuNode;
        projects: MenuNode;
        resources: MenuNode;
        news: MenuNode;
        tenders: MenuNode;
        careers: MenuNode;
        newsletters: MenuNode;
        contact: MenuNode;
        customerPortal: MenuNode;
  }>,
): MenuNode[] {
    const out = base.map((n) => ({...n}));
    if (dynamic.about) replaceOrAppendRoot(out, dynamic.about);
    if (dynamic.services) replaceOrAppendRoot(out, dynamic.services);
    if (dynamic.projects) replaceOrAppendRoot(out, dynamic.projects);
    if (dynamic.resources) replaceOrAppendRoot(out, dynamic.resources);
    if (dynamic.news) replaceOrAppendRoot(out, dynamic.news);
    if (dynamic.tenders) replaceOrAppendRoot(out, dynamic.tenders);
    if (dynamic.careers) replaceOrAppendRoot(out, dynamic.careers);
    if (dynamic.newsletters) replaceOrAppendRoot(out, dynamic.newsletters);
    if (dynamic.contact) replaceOrAppendRoot(out, dynamic.contact);
    if (dynamic.customerPortal) replaceOrAppendRoot(out, dynamic.customerPortal);
    return pruneInvalidLeaves(out);
}
