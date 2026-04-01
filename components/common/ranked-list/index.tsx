'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/form-elements/button';
import { CardWrapper2 } from '@/components/card/card-2';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/common/table';
import { ConfirmationModal } from '@/components/common/modal/confirmation-modal';
import { SortableItem, SortableList } from '@/components/common/sortable-list';

import { FiChevronRight, FiEdit2, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import { DynamicIconClient } from '@/components/icons/DynamicIconClient';

export type RankedRow = SortableItem & {
  name?: string;
  title?: string;
  /** Typically a short description (already truncated by the caller) */
  extra1?: string | null;
  /** Icon key, e.g. "md:MdHandshake" — will render the actual icon */
  extra2?: string | null;
  /** Pills rendered under the primary name/title cell */
  quickLinks?: { label: string; href: string }[];
};

type Props = {
  headerLabel: string;
  editBasePath: string;
  rows: RankedRow[];
  onDeleteAction: (id: string) => Promise<void>;
  onReorderAction: (items: { id: string; rank: number }[]) => Promise<void>;
  addHref: string;
  /** Which secondary text to show in the second column */
  secondaryTextField?: keyof Pick<RankedRow, 'extra1' | 'extra2'>;
  columns?: {
    nameLabel?: string;
    extra1Label?: string;
    extra2Label?: string;
  };
  /** Optional custom per-row actions (e.g., Publish/Feature buttons for News) */
  renderRowAction?: (row: RankedRow) => ReactNode;
};

export function RankedList({
  headerLabel,
  rows,
  onDeleteAction,
  onReorderAction,
  editBasePath,
  addHref,
  secondaryTextField = 'extra2',
  columns = {
    nameLabel: 'Name / Title',
    extra1Label: 'Details',
    extra2Label: 'Icon',
  },
  renderRowAction,
}: Props) {
  const [data, setData] = useState(rows);
  const [isReordering, setIsReordering] = useState(false);
  const [pending, setPending] = useState<{ id: string; rank: number }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  // ⬇️ Keep the internal table state in sync with server-provided rows (e.g., after router.refresh())
  useEffect(() => {
    setData(rows);
    setIsReordering(false);
    setPending([]);
  }, [rows]);

  const handleReorder = (items: RankedRow[]) => {
    setData(items);
    setPending(items.map((i) => ({ id: i.id, rank: i.rank })));
  };

  const handleStartReordering = () => {
    setPending([]);
    setIsReordering(true);
  };

  const handleCancelReordering = () => {
    setData(rows);
    setIsReordering(false);
    setPending([]);
  };

  const handleSaveOrder = async () => {
    if (pending.length === 0) {
      setIsReordering(false);
      return;
    }
    setIsSaving(true);
    try {
      await onReorderAction(pending);
      setIsReordering(false);
      toast.success('Order updated successfully');
    } catch {
      toast.error('Failed to update order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setTargetId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetId) return;
    try {
      await onDeleteAction(targetId);
      const updated = data.filter((x) => x.id !== targetId).map((x, i) => ({ ...x, rank: i + 1 }));
      setData(updated);
      toast.success('Deleted successfully');
    } catch {
      toast.error('Failed to delete');
    }
    setShowModal(false);
  };

  const getSecondaryText = (row: RankedRow): string | undefined => {
    const value = row[secondaryTextField];
    return typeof value === 'string' && value.trim() ? value : undefined;
  };

  const headerActions = (
    <>
      <Link href={addHref}>
        <Button variant="primary" type="button" size="small">
          Add New
        </Button>
      </Link>
      {isReordering ? (
        <>
          <Button
            variant="outline-primary"
            size="small"
            onClick={handleCancelReordering}
            icon={<FiX size={14} />}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            type="button"
            onClick={handleSaveOrder}
            icon={<FiSave size={14} />}
            isLoading={isSaving}
            disabled={isSaving || pending.length === 0}
          >
            Save Order
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline-primary"
          size="small"
          onClick={handleStartReordering}
        >
          Reorder
        </Button>
      )}
    </>
  );

  return (
    <CardWrapper2 headerLabel={headerLabel} headerActions={headerActions}>
      {isReordering ? (
        <SortableList
          items={data}
          onReorder={handleReorder}
          instructionText="Drag items to rearrange order, then click 'Save Order'."
          getSecondaryText={getSecondaryText}
        />
      ) : (
        <Table variant="striped" hover>
          <TableHead>
            <TableRow>
              <TableCell variant="th">{columns.nameLabel}</TableCell>
              <TableCell variant="th">{columns.extra1Label}</TableCell>
              <TableCell variant="th">{columns.extra2Label}</TableCell>
              <TableCell variant="th">Order</TableCell>
              <TableCell variant="th" align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const name = row.name ?? row.title ?? '';
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    {name}

                    {row.quickLinks && row.quickLinks.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {row.quickLinks.map((a, idx) => (
                          <Link
                            key={`${row.id}-${a.label}-${idx}`}
                            href={a.href}
                            className="badge rounded-pill text-bg-light border px-3 py-2 d-inline-flex align-items-center gap-1 text-decoration-none"
                          >
                            <span>{a.label}</span>
                            <FiChevronRight size={14} />
                          </Link>
                        ))}
                      </div>
                    )}
                  </TableCell>

                  {/* Secondary text column (e.g. truncated description) */}
                  <TableCell>{row.extra1 ?? '-'}</TableCell>

                  {/* Icon column: render the real icon from icon key */}
                  <TableCell>
                    {row.extra2 ? (
                      <DynamicIconClient
                        iconKey={row.extra2}
                        size={18}
                        className="text-muted"
                        loadingFallback={<span className="text-muted">…</span>}
                        errorFallback={<span className="text-muted">-</span>}
                      />
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </TableCell>

                  <TableCell>#{row.rank}</TableCell>

                  {/* Right-aligned unified actions row */}
                  <TableCell align="right">
                    <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                      {renderRowAction?.(row)}

                      <Link href={`${editBasePath}/${row.id}/edit`}>
                        <Button variant="outline-primary" size="small" icon={<FiEdit2 size={14} />}>
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="outline-danger"
                        size="small"
                        icon={<FiTrash2 size={14} />}
                        onClick={() => handleDeleteClick(row.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <ConfirmationModal
        show={showModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this item?"
        onCancel={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        variant="danger"
        alertVariant="danger"
      />
    </CardWrapper2>
  );
}
