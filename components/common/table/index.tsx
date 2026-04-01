'use client';

import { cn } from '@/lib/utils';
import styles from './table.module.css';
import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Table = ({
  variant = 'default',
  size = 'md',
  hover = true,
  className,
  children,
  ...props
}: TableProps) => {
  return (
    <div className={styles.tableWrapper}>
      <table
        className={cn(
          styles.table,
          styles[`table-${variant}`],
          styles[`table-${size}`],
          { [styles.tableHover]: hover },
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn(styles.tableHead, className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn(styles.tableBody, className)} {...props}>
    {children}
  </tbody>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  active?: boolean;
}

export const TableRow = ({ className, active, children, ...props }: TableRowProps) => (
  <tr className={cn(styles.tableRow, { [styles.tableRowActive]: active }, className)} {...props}>
    {children}
  </tr>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  variant?: 'th' | 'td';
  align?: 'left' | 'center' | 'right';
}

export const TableCell = ({
  variant = 'td',
  align = 'left',
  className,
  children,
  ...props
}: TableCellProps) => {
  const Component = variant === 'th' ? 'th' : 'td';

  return (
    <Component
      className={cn(
        styles.tableCell,
        styles[`tableCell-${variant}`],
        styles[`tableCell-${align}`],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
