'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { CardWrapper2 } from '@/components/card/card-2';
import { Button } from '@/components/form-elements/button';
import { Input } from '@/components/form-elements/input';
import { deleteOrganization } from '@/actions/organization/delete';

type Props = {
  id: string;
  name: string; // pass the exact org name to compare against
};

export function OrganizationDangerZone({ id, name }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const canDelete = typed === name; // exact, case-sensitive match

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deleteOrganization({ id, confirmName: typed });
        toast.success('Organization deleted');
        setTyped('');
        setConfirming(false);
        router.refresh();
      } catch (e) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : 'Failed to delete organization');
      }
    });
  };

  return (
    <CardWrapper2 headerLabel="Danger Zone">
      <p className="text-danger mb-3">
        Deleting the organization will remove its configuration. This action cannot be undone.
      </p>

      {!confirming ? (
        <Button variant="outline-danger" onClick={() => setConfirming(true)}>
          Delete Organization
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
              aria-label="Type the organization name to confirm deletion"
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
            {/* Hide delete button until exact match */}
            {canDelete && (
              <Button variant="danger" onClick={onDelete} disabled={isPending}>
                {isPending ? 'Deleting…' : 'Delete organization'}
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
