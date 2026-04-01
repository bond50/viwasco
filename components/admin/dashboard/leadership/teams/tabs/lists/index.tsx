// components/admin/dashboard/leadership/teams/tabs/lists.tsx
'use client';

import { useMemo, useState } from 'react';

import { useFormAction } from '@/hooks/use-form-action';
import { FormError } from '@/components/form-error';
import { SaveUpdateButton } from '@/components/form-elements/submit-button';

import type { TeamListsState, TeamSettingsData } from '@/lib/types/about/leadership';
import type { ManagementTeamListsValues } from '@/lib/schemas/about/content/leadership';
import { updateTeamMemberLists } from '@/actions/about/content/leadership';

type Props = { team: TeamSettingsData };

type ListKey = 'languages' | 'boardCommittees' | 'professionalAffiliations' | 'awards';

export function TeamListsTab({ team }: Props) {
  const initial: TeamListsState = useMemo(
    () => ({
      languages: team.lists.languages ?? [],
      boardCommittees: team.lists.boardCommittees ?? [],
      professionalAffiliations: team.lists.professionalAffiliations ?? [],
      awards: team.lists.awards ?? [],
    }),
    [team],
  );

  const [lists, setLists] = useState<TeamListsState>(initial);
  const [drafts, setDrafts] = useState<Record<ListKey, string>>({
    languages: '',
    boardCommittees: '',
    professionalAffiliations: '',
    awards: '',
  });

  const { formAction, pending, formError } = useFormAction<ManagementTeamListsValues>(
    updateTeamMemberLists.bind(null, team.id),
    {
      successMessage: 'Saved',
      errorMessage: 'Failed to save',
    },
  );

  const addItem = (key: ListKey) => {
    const value = drafts[key].trim();
    if (!value) return;
    setLists((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key] : [...prev[key], value],
    }));
    setDrafts((prev) => ({ ...prev, [key]: '' }));
  };

  const removeItem = (key: ListKey, idx: number) => {
    setLists((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));
  };

  const reset = () => {
    setLists(initial);
    setDrafts({
      languages: '',
      boardCommittees: '',
      professionalAffiliations: '',
      awards: '',
    });
  };

  const renderListEditor = (key: ListKey, label: string, placeholder: string) => (
    <div className="col-md-6 mb-3" key={key}>
      <label className="form-label d-flex justify-content-between align-items-center">
        <span>{label}</span>
        {lists[key].length > 0 && (
          <span className="badge text-bg-light">{lists[key].length} item(s)</span>
        )}
      </label>

      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={drafts[key]}
          onChange={(e) => setDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem(key);
            }
          }}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => addItem(key)}
          disabled={!drafts[key].trim()}
        >
          Add
        </button>
      </div>

      {lists[key].map((item, idx) => (
        <input key={`${key}-hidden-${idx}`} type="hidden" name={key} value={item} />
      ))}

      {lists[key].length > 0 ? (
        <ul className="list-group small">
          {lists[key].map((item, idx) => (
            <li
              key={`${key}-${item}-${idx}`}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span className="text-wrap">{item}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => removeItem(key, idx)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-secondary mt-2 mb-0 py-2 small">No items added yet.</div>
      )}
    </div>
  );

  return (
    <form action={formAction}>
      <div className="row g-3">
        {renderListEditor('languages', 'Languages', 'e.g. English, Kiswahili')}
        {renderListEditor('boardCommittees', 'Board Committees', 'e.g. Finance & Planning')}
        {renderListEditor(
          'professionalAffiliations',
          'Professional Affiliations',
          'e.g. ICPAK, LSK',
        )}
        {renderListEditor('awards', 'Awards', 'e.g. Best Manager 2023')}
      </div>

      <FormError message={formError ?? undefined} />
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={reset}
          disabled={pending}
        >
          Reset
        </button>
        <SaveUpdateButton isEdit pending={pending} variant="primary" />
      </div>
    </form>
  );
}
