import type { ReactNode } from 'react';
import { LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import LoadingSpinner from './LoadingSpinner';

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  minWidth?: number | string;
  /** Cells never wrap by default (phones, emails, dates stay on one line). Set true for long text. */
  wrap?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[] | null;
  rowKey: (row: T) => string | number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
  /** Remove the outer border so the table can sit inside a card. */
  embedded?: boolean;
}

/** Compact enterprise table with built-in loading, error and empty states. */
export default function DataTable<T>({
  columns, rows, rowKey, loading, error, onRetry, emptyTitle = 'Nothing to show yet', emptyMessage, emptyAction, onRowClick, embedded,
}: Props<T>) {
  if (error) return <ErrorAlert message={error} onRetry={onRetry} />;
  if (loading && (!rows || rows.length === 0)) return <LoadingSpinner />;

  return (
    <Paper
      variant={embedded ? undefined : 'outlined'}
      elevation={0}
      sx={{ borderRadius: embedded ? 0 : 1.5, overflow: 'hidden', borderColor: '#E2E8F0', boxShadow: embedded ? 'none' : '0 1px 2px rgba(15,23,42,0.04)' }}
    >
      {loading && <LinearProgress sx={{ height: 2 }} />}
      {!rows || rows.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.header} align={column.align} sx={{ width: column.width, minWidth: column.minWidth }}>
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:nth-of-type(even)': { bgcolor: '#F4F8FE' },
                    '&:hover': { bgcolor: onRowClick ? '#E3EDFC' : '#EEF4FD' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.header}
                      align={column.align}
                      sx={{ minWidth: column.minWidth, whiteSpace: column.wrap ? 'normal' : 'nowrap' }}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
