'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormAction } from '@/hooks/use-form-action';
import { CardWrapper2 } from '@/components/card/card-2';
import { Input } from '@/components/form-elements/input';
import { Button } from '@/components/form-elements/button';
import { FormError } from '@/components/form-error';
import ClipLoader from 'react-spinners/ClipLoader';
import { saveTeamPublication } from '@/actions/about/content/leadership/team-publication';
import type { TeamPublicationFormValues } from '@/lib/schemas/about/content/leadership';

type Props = {
  initial?: TeamPublicationFormValues | null;
  teamId: string;
  closeAction: () => void;
};

export function TeamPublicationForm({ initial, teamId, closeAction }: Props) {
  const router = useRouter();
  const { formAction, pending, getError, formError, state } =
    useFormAction<TeamPublicationFormValues>(saveTeamPublication, {
      successMessage: 'Saved publication',
      errorMessage: 'Failed to save publication',
    });

  useEffect(() => {
    if (!state?.success) return;
    closeAction();
    router.refresh();
  }, [closeAction, router, state?.success]);

  const current = state?.values ?? initial ?? null;
  const isEditing = Boolean(current?.id);

  return (
    <CardWrapper2 headerLabel={isEditing ? 'Edit Publication' : 'Add Publication'}>
      <form action={formAction} className="row g-3">
        {/* Hidden identifiers */}
        <input type="hidden" name="teamId" value={teamId} />
        {current?.id && <input type="hidden" name="id" value={current.id} />}

        {/* Helper text: what is a publication? */}
        <div className="col-12">
          <p className="text-muted small mb-2">
            A publication is any formal piece of written work that can be cited—for example a
            journal article, conference paper, report, policy brief, book chapter, or industry case
            study.
          </p>
        </div>

        {/* Title + Year on one row */}
        <div className="col-12 col-md-8">
          <Input
            name="title"
            label="Publication Title *"
            placeholder="e.g., Water Governance and Climate Resilience"
            defaultValue={current?.title ?? ''}
            error={getError('title')}
          />
        </div>

        <div className="col-12 col-md-4">
          <Input
            name="year"
            label="Year"
            type="number"
            placeholder="e.g., 2023"
            defaultValue={current?.year?.toString() ?? ''}
            error={getError('year')}
          />
        </div>

        {/* URL (full width, compact) */}
        <div className="col-12">
          <Input
            name="url"
            label="Link to publication (URL)"
            placeholder="e.g., https://doi.org/10.1234/abcd or link to PDF/article"
            defaultValue={current?.url ?? ''}
          />
        </div>

        {/* Optional: metadata JSON (still commented out) */}
        {/* <div className="col-12">
          <Input
            name="metadata"
            as="textarea"
            label="Extra Information (JSON, Optional)"
            placeholder='e.g. {"journal": "Nairobi Water Review", "volume": "12(3)"}'
            defaultValue={
              current?.metadata ? JSON.stringify(current.metadata, null, 2) : ''
            }
          />
        </div> */}

        <div className="col-12">
          <FormError message={formError ?? undefined} />
        </div>

        {/* Actions: compact, right-aligned */}
        <div className="col-12 d-flex justify-content-end gap-2 mt-1">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? (
              <>
                <ClipLoader size={16} /> Saving…
              </>
            ) : (
              'Save publication'
            )}
          </Button>

          <Button type="button" variant="outline-primary" onClick={closeAction}>
            Cancel
          </Button>
        </div>
      </form>
    </CardWrapper2>
  );
}
