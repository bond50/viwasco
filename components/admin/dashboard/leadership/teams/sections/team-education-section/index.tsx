'use client';

import { useState } from 'react';
import { Button } from '@/components/form-elements/button';
import { TeamEducationForm } from '@/components/admin/dashboard/leadership/teams/tabs/profile/forms/team-education-form';
import type { AdminTeamEducationRow } from '@/lib/types/about/leadership';

type Props = {
  teamId: string;
  educations: AdminTeamEducationRow[];
};

export function TeamEducationSection({ teamId, educations }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const editing = educations.find((e) => e.id === openId) ?? null;

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Education History</h5>

        <Button variant="primary" onClick={() => setOpenId('new')}>
          Add Education
        </Button>
      </div>

      {/* Form */}
      {openId && (
        <TeamEducationForm
          teamId={teamId}
          closeAction={() => setOpenId(null)}
          initial={
            openId === 'new'
              ? null
              : editing
                ? {
                    ...editing,
                    startDate: editing.startDate
                      ? editing.startDate.toISOString().slice(0, 10)
                      : null,
                    endDate: editing.endDate ? editing.endDate.toISOString().slice(0, 10) : null,
                  }
                : null
          }
        />
      )}

      {/* List */}
      <ul className="list-group mt-3">
        {educations.map((edu) => (
          <li
            key={edu.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{edu.institution}</strong>
              <div className="small text-muted">
                {edu.qualification ?? '—'} — {edu.level ?? '—'}
              </div>
            </div>

            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setOpenId(edu.id)}>
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
