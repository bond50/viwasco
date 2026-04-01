import React from 'react';

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = ({ children, ...props }: TableCellProps) => {
  return <td {...props}>{children}</td>;
};
