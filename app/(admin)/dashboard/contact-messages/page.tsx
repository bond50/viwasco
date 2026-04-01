import Link from 'next/link';

import { Button } from '@/components/form-elements/button';
import { CardWrapper2 } from '@/components/card/card-2';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/common/table';
import { listContactMessages } from '@/lib/data/admin/contact-messages';

export default async function ContactMessagesPage() {
  const rows = await listContactMessages();

  return (
    <CardWrapper2 headerLabel="Contact Messages">
      <Table variant="striped" hover>
        <TableHead>
          <TableRow>
            <TableCell variant="th">Name</TableCell>
            <TableCell variant="th">Subject</TableCell>
            <TableCell variant="th">Type</TableCell>
            <TableCell variant="th">Status</TableCell>
            <TableCell variant="th">Created</TableCell>
            <TableCell variant="th" align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.full_name}</TableCell>
              <TableCell>{row.subject}</TableCell>
              <TableCell>{row.contact_type}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{new Date(row.created_at).toLocaleString('en-KE')}</TableCell>
              <TableCell align="right">
                <Link href={`/dashboard/contact-messages/${row.id}`}>
                  <Button variant="outline-primary" size="small">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardWrapper2>
  );
}
