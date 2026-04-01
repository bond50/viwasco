'use client';

import { useState } from 'react';
import type { AdminTeamPublicationRow } from '@/lib/types/about/leadership';
import { Button } from '@/components/form-elements/button';
import { deleteTeamPublication } from '@/actions/about/content/leadership/team-publication';
import { TeamPublicationForm } from './team-publication-form';

type Props = {
  teamId: string;
  publications: AdminTeamPublicationRow[];
};

export function TeamPublicationSection({ teamId, publications }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const editing = publications.find((p) => p.id === openId) ?? null;

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between mb-2">
        <h5 className="mb-0">Publications</h5>
        <Button variant="primary" onClick={() => setOpenId('new')}>
          + Add Publication
        </Button>
      </div>

      {/* Inline Form */}
      {openId && (
        <div className="mt-3">
          <TeamPublicationForm
            teamId={teamId}
            closeAction={() => setOpenId(null)}
            initial={
              openId === 'new'
                ? null
                : editing
                  ? {
                      ...editing,
                      year: editing.year ?? null,
                    }
                  : null
            }
          />
        </div>
      )}

      <ul className="list-group mt-3">
        {publications.map((p) => (
          <li key={p.id} className="list-group-item d-flex justify-content-between">
            <div>
              <strong>{p.title}</strong>
              <div className="small text-muted">{p.year ?? '—'}</div>
            </div>

            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setOpenId(p.id)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => deleteTeamPublication(p.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
