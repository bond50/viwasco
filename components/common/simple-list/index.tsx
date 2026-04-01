// components/dashboard/about/common/about-simple-list.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/form-elements/button';
import { CardWrapper2 } from '@/components/card/card-2';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/common/table';
import { ConfirmationModal } from '@/components/common/modal/confirmation-modal';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

export type SimpleRow = {
  id: string;
  title: string;
  extra1?: string | null;
  extra2?: string | null;
};

type Props = {
  headerLabel: string;
  editBasePath: string;
  rows: SimpleRow[];
  onDeleteAction: (id: string) => Promise<void>;
  addHref: string;
  columns?: { nameLabel?: string; extra1Label?: string; extra2Label?: string };
};

export function SimpleList({
  headerLabel,
  rows,
  onDeleteAction,
  editBasePath,
  addHref,
  columns = { nameLabel: 'Title', extra1Label: 'Info', extra2Label: 'Status' },
}: Props) {
  const [data, setData] = useState(rows);
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const headerActions = (
    <Link href={addHref}>
      <Button variant="primary" size="small">
        Add New
      </Button>
    </Link>
  );

  const handleDeleteClick = (id: string) => {
    setTargetId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetId) return;
    try {
      await onDeleteAction(targetId);
      setData((s) => s.filter((r) => r.id !== targetId));
      toast.success('Deleted successfully');
    } catch {
      toast.error('Failed to delete');
    }
    setShowModal(false);
  };

  return (
    <CardWrapper2 headerLabel={headerLabel} headerActions={headerActions}>
      <Table variant="striped" hover>
        <TableHead>
          <TableRow>
            <TableCell variant="th">{columns.nameLabel}</TableCell>
            <TableCell variant="th">{columns.extra1Label}</TableCell>
            <TableCell variant="th">{columns.extra2Label}</TableCell>
            <TableCell variant="th" align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.extra1 ?? '-'}</TableCell>
              <TableCell>{row.extra2 ?? '-'}</TableCell>
              <TableCell align="right">
                <div className="d-flex gap-2 justify-content-end">
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
          ))}
        </TableBody>
      </Table>
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
