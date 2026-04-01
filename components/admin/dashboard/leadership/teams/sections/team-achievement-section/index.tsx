'use client';

import { useState } from 'react';
import type { AdminTeamAchievementRow } from '@/lib/types/about/leadership';
import { Button } from '@/components/form-elements/button';
import { deleteTeamAchievement } from '@/actions/about/content/leadership/team-achievement';
import { TeamAchievementForm } from './team-achievement-form';

type Props = {
  teamId: string;
  achievements: AdminTeamAchievementRow[];
};

export function TeamAchievementSection({ teamId, achievements }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const editing = achievements.find((a) => a.id === openId) ?? null;

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Achievements</h5>
        <Button variant="primary" onClick={() => setOpenId('new')}>
          + Add Achievement
        </Button>
      </div>

      {/* Inline form */}
      {openId && (
        <div className="mt-3">
          <TeamAchievementForm
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
        {achievements.map((ach) => (
          <li key={ach.id} className="list-group-item d-flex justify-content-between">
            <div>
              <strong>{ach.title}</strong>
              <div className="small text-muted">{ach.year ?? '—'}</div>
            </div>

            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setOpenId(ach.id)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => deleteTeamAchievement(ach.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
