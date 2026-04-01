// components/admin/dashboard/leadership/teams/team-danger-zone.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { CardWrapper2 } from '@/components/card/card-2';
import { Button } from '@/components/form-elements/button';
import { Input } from '@/components/form-elements/input';
import { deleteTeamMember } from '@/actions/about/content/leadership';
// ^ adjust this import path to wherever you put `deleteTeamMember`

type Props = {
  id: string;
  name: string; // exact team member name
};

export function TeamDangerZone({ id, name }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const canDelete = typed === name; // case-sensitive match

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deleteTeamMember(id);
        toast.success('Team member deleted');
        setTyped('');
        setConfirming(false);
        // After delete, go back to teams list
        router.push('/dashboard/about/leadership/teams');
        router.refresh();
      } catch (e) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : 'Failed to delete team member');
      }
    });
  };

  return (
    <CardWrapper2 headerLabel="Danger Zone">
      <p className="text-danger mb-3">
        Deleting this team member will remove their leadership profile. This action cannot be
        undone.
      </p>

      {!confirming ? (
        <Button variant="outline-danger" onClick={() => setConfirming(true)}>
          Delete Team Member
        </Button>
      ) : (
        <div className="border rounded p-3">
          <p className="mb-2">
            To confirm, type <strong>{name}</strong> exactly:
          </p>

          <div className="mb-2">
            <Input
              name="confirmName"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={name}
              aria-label="Type the team member name to confirm deletion"
              autoFocus
            />
            <div className="small mt-1" aria-live="polite">
              {typed.length === 0 && (
                <span className="text-muted">Name must match exactly (case & spacing).</span>
              )}
              {typed.length > 0 && !canDelete && (
                <span className="text-muted">Still not an exact match.</span>
              )}
              {canDelete && <span className="text-success">Name matched. You can delete now.</span>}
            </div>
          </div>

          <div className="d-flex gap-2 align-items-center">
            {canDelete && (
              <Button variant="danger" onClick={onDelete} disabled={isPending}>
                {isPending ? 'Deleting…' : 'Delete team member'}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                setConfirming(false);
                setTyped('');
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </CardWrapper2>
  );
}
