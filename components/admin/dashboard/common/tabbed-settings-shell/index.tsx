// components/admin/dashboard/common/tabbed-settings-shell.tsx
'use client';

import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CardWrapper2 } from '@/components/card/card-2';

export type SettingsSectionItem<TData> = {
  id: string;
  label: string;
  render: (data: TData) => React.ReactNode;
};

export type SettingsSectionConfig<TData> = {
  key: string; // URL key (?section=)
  label: string; // top tab label
  topId: string;
  listId: string;
  contentId: string;
  items: SettingsSectionItem<TData>[];
};

type TabbedSettingsShellProps<TData> = {
  headerLabel: string;
  data: TData;
  sections: SettingsSectionConfig<TData>[];
  /** Optional initial core-values from server (searchParams) */
  initialSectionKey?: string | null;
  initialTabId?: string | null;
};

export function TabbedSettingsShell<TData>({
  headerLabel,
  data,
  sections,
  initialSectionKey,
  initialTabId,
}: TabbedSettingsShellProps<TData>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getSectionIndexByKey = (key: string | null): number => {
    if (!key) return -1;
    return sections.findIndex((s) => s.key === key);
  };

  const getSectionIndexByTabId = (tabId: string | null): number => {
    if (!tabId) return -1;
    return sections.findIndex((section) => section.items.some((item) => item.id === tabId));
  };

  const [activeTopIdx, setActiveTopIdx] = useState<number>(() => {
    const fromSection = getSectionIndexByKey(initialSectionKey ?? searchParams.get('section'));
    if (fromSection >= 0) return fromSection;

    const fromTab = getSectionIndexByTabId(initialTabId ?? searchParams.get('tab'));
    if (fromTab >= 0) return fromTab;

    return 0;
  });

  const [subActiveByTopKey, setSubActiveByTopKey] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    const tabId = initialTabId ?? searchParams.get('tab');

    for (const section of sections) {
      if (tabId) {
        const idx = section.items.findIndex((item) => item.id === tabId);
        map[section.key] = idx >= 0 ? idx : 0;
      } else {
        map[section.key] = 0;
      }
    }
    return map;
  });

  const setActiveSub = (topKey: string, idx: number) =>
    setSubActiveByTopKey((prev) => ({ ...prev, [topKey]: idx }));

  const updateUrl = (sectionKey: string, tabId: string) => {
    if (!tabId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('section', sectionKey);
    params.set('tab', tabId);
    const search = params.toString();
    const href = search ? `${pathname}?${search}` : pathname;
    router.replace(href, { scroll: false });
  };

  const activeTop = sections[activeTopIdx] ?? sections[0];
  const activeSubIdx = subActiveByTopKey[activeTop.key] ?? subActiveByTopKey[activeTop.key] ?? 0;

  return (
    <CardWrapper2 headerLabel={headerLabel}>
      {/* Top-level tabs */}
      <ul className="nav nav-tabs" role="tablist">
        {sections.map((section, index) => {
          const selected = index === activeTopIdx;
          return (
            <li className="nav-item" role="presentation" key={section.key}>
              <button
                type="button"
                className={`nav-link ${selected ? 'active' : ''}`}
                role="tab"
                id={`${section.topId}-tab`}
                aria-controls={section.topId}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  setActiveTopIdx(index);
                  const subIdx = subActiveByTopKey[section.key] ?? 0;
                  const currentItem = section.items[subIdx] ?? section.items[0];
                  const tabId = currentItem?.id ?? '';
                  if (tabId) {
                    updateUrl(section.key, tabId);
                  }
                }}
              >
                {section.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Top-level tab panes */}
      <div className="tab-content pt-3">
        {sections.map((section, index) => {
          const isTopActive = index === activeTopIdx;
          const subActive =
            index === activeTopIdx ? activeSubIdx : (subActiveByTopKey[section.key] ?? 0);

          return (
            <div
              key={section.key}
              className={`tab-pane fade ${isTopActive ? 'show active' : ''}`}
              id={section.topId}
              role="tabpanel"
              aria-labelledby={`${section.topId}-tab`}
            >
              {isTopActive && (
                <div className="row g-3 pt-3">
                  {/* Left: nested list */}
                  <div className="col-12 col-md-4 col-lg-3">
                    <ul className="list-group" id={section.listId} role="tablist">
                      {section.items.map((item, itemIndex) => {
                        const selected = itemIndex === subActive;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`list-group-item list-group-item-action ${
                              selected ? 'active' : ''
                            }`}
                            role="tab"
                            id={`${item.id}-tab`}
                            aria-controls={item.id}
                            aria-selected={selected}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => {
                              setActiveSub(section.key, itemIndex);
                              updateUrl(section.key, item.id);
                            }}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Right: nested tab panes */}
                  <div className="col-12 col-md-8 col-lg-9">
                    <div className="tab-content" id={section.contentId}>
                      {section.items.map((item, itemIndex) => {
                        const isActive = itemIndex === subActive;
                        return (
                          <div
                            key={item.id}
                            className={`tab-pane fade ${isActive ? 'show active' : ''}`}
                            id={item.id}
                            role="tabpanel"
                            aria-labelledby={`${item.id}-tab`}
                          >
                            {isActive && item.render(data)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </CardWrapper2>
  );
}
