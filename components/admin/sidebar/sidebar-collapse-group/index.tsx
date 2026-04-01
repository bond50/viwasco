import React from 'react';

type SidebarCollapseGroupProps = {
  id: string; // e.g. "components-nav"
  iconClass: string; // e.g. "bi bi-menu-button-wide"
  label: string; // e.g. "Components"
  children: React.ReactNode; // <SidebarContentLink/> items
};

export function SidebarCollapseGroup({
  id,
  iconClass,
  label,
  children,
}: SidebarCollapseGroupProps) {
  return (
    <li className="nav-item">
      <button
        type="button"
        className="nav-link collapsed" // keep classes for CSS
        data-bs-toggle="collapse"
        data-bs-target={`#${id}`}
        aria-expanded="false"
        aria-controls={id}
      >
        <i className={iconClass}></i>
        <span>{label}</span>
        <i className="bi bi-chevron-down ms-auto"></i>
      </button>

      <ul id={id} className="nav-content collapse " data-bs-parent="#sidebar-nav">
        {children}
      </ul>
    </li>
  );
}
