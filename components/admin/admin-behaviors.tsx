'use client';

import { useEffect } from 'react';

// tiny helpers
const $one = (sel: string, root: Document | HTMLElement = document) =>
  root.querySelector(sel) as HTMLElement | null;
const $all = (sel: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll(sel)) as HTMLElement[];

export function AdminBehaviors() {
  useEffect(() => {
    // This effect only runs on the client, AFTER hydration.
    let disposeTooltips: (() => void) | null = null;

    // --- Sidebar toggle ---
    const body = document.body;
    const toggleSidebarBtn = $one('.toggle-sidebar-btn');
    const onToggleSidebar = () => body.classList.toggle('toggle-sidebar');
    toggleSidebarBtn?.addEventListener('click', onToggleSidebar);

    // --- Search bar toggle ---
    const searchToggle = $one('.search-bar-toggle');
    const searchBar = $one('.search-bar');
    const onSearchToggle = () => searchBar?.classList.toggle('search-bar-show');
    if (searchToggle && searchBar) {
      searchToggle.addEventListener('click', onSearchToggle);
    }

    // --- Navbar links active on scroll ---
    const navbarLinks = $all('#navbar .scrollto');
    const navbarLinksActive = () => {
      const position = window.scrollY + 200;
      navbarLinks.forEach((link) => {
        const a = link as HTMLAnchorElement;
        const hash = a.hash;
        if (!hash) return;
        const section = $one(hash);
        if (!section) return;
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (position >= top && position <= bottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };
    window.addEventListener('load', navbarLinksActive);
    window.addEventListener('scroll', navbarLinksActive);

    // --- Header scrolled class (#header) ---
    const header = $one('#header');
    const headerScrolled = () => {
      if (!header) return;
      if (window.scrollY > 100) header.classList.add('header-scrolled');
      else header.classList.remove('header-scrolled');
    };
    window.addEventListener('load', headerScrolled);
    window.addEventListener('scroll', headerScrolled);

    // --- Back to top (.back-to-top) ---
    const backToTop = $one('.back-to-top');
    const toggleBackToTop = () => {
      if (!backToTop) return;
      if (window.scrollY > 100) backToTop.classList.add('active');
      else backToTop.classList.remove('active');
    };
    window.addEventListener('load', toggleBackToTop);
    window.addEventListener('scroll', toggleBackToTop);

    // --- Bootstrap validation (.needs-validation) ---
    const needsValidation = Array.from(
      document.querySelectorAll('.needs-validation'),
    ) as HTMLFormElement[];
    const submitHandlers = new Map<HTMLFormElement, (e: Event) => void>();
    needsValidation.forEach((form) => {
      const handler = (event: Event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      };
      submitHandlers.set(form, handler);
      form.addEventListener('submit', handler, false);
    });

    // --- Tooltips (Bootstrap) ---
    // IMPORTANT: this runs inside useEffect, so it's AFTER hydration.
    // We also dynamic-import inside the effect so nothing executes on the server.
    void (async () => {
      // Load the full bundle (Popper + plugins etc.)
      await import('bootstrap/dist/js/bootstrap.bundle.min.js');

      // Load Tooltip specifically
      const { default: Tooltip } = await import('bootstrap/js/dist/tooltip');

      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]'),
      );

      const instances = nodes.map((el) => new Tooltip(el));

      disposeTooltips = () => {
        instances.forEach((instance) => instance.dispose());
      };
    })();

    return () => {
      // Cleanup events
      toggleSidebarBtn?.removeEventListener('click', onToggleSidebar);
      if (searchToggle && searchBar) {
        searchToggle.removeEventListener('click', onSearchToggle);
      }
      window.removeEventListener('load', navbarLinksActive);
      window.removeEventListener('scroll', navbarLinksActive);
      window.removeEventListener('load', headerScrolled);
      window.removeEventListener('scroll', headerScrolled);
      window.removeEventListener('load', toggleBackToTop);
      window.removeEventListener('scroll', toggleBackToTop);

      submitHandlers.forEach((fn, form) => {
        form.removeEventListener('submit', fn);
      });

      if (disposeTooltips) {
        disposeTooltips();
      }
    };
  }, []);

  // No visible UI; this component only wires behaviours
  return null;
}
