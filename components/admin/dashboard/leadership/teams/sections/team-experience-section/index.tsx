'use client';

import { useState } from 'react';
import type { AdminTeamExperienceRow } from '@/lib/types/about/leadership';
import { Button } from '@/components/form-elements/button';
import { deleteTeamExperience } from '@/actions/about/content/leadership/team-experience';
import { TeamExperienceForm } from './team-experience-form';
import { toInputDate } from '@/lib/utils/process-date-field';

type Props = {
  teamId: string;
  experiences: AdminTeamExperienceRow[];
};

export function TeamExperienceSection({ teamId, experiences }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const editing = experiences.find((e) => e.id === openId) ?? null;

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Experience</h5>
        <Button variant="primary" onClick={() => setOpenId('new')}>
          + Add Experience
        </Button>
      </div>

      {/* Inline Form */}
      {openId && (
        <div className="mt-3">
          <TeamExperienceForm
            teamId={teamId}
            closeAction={() => setOpenId(null)}
            initial={
              openId === 'new'
                ? null
                : editing
                  ? {
                      ...editing,
                      startDate: toInputDate(editing.startDate),
                      endDate: toInputDate(editing.endDate),
                    }
                  : null
            }
          />
        </div>
      )}

      <ul className="list-group mt-3">
        {experiences.map((exp) => (
          <li
            key={exp.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{exp.role}</strong>
              <div className="text-muted small">{exp.organization ?? 'No organization'}</div>
            </div>

            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setOpenId(exp.id)}>
                Edit
              </Button>

              <Button variant="danger" onClick={() => deleteTeamExperience(exp.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
