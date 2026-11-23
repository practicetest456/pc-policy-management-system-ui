import type { ReactNode } from 'react';
import { Box, Card, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface Props {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
  sx?: SxProps<Theme>;
}

/** Dashboard card with a navy title bar and an optional action ("View all"). */
export default function SectionCard({ title, action, children, noPadding, sx }: Props) {
  return (
    <Card sx={{ overflow: 'hidden', ...(sx as object) }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, minHeight: 46, bgcolor: '#E9F0FB', borderBottom: '1px solid #D3E0F4', borderLeft: '4px solid #1D5FD1' }}>
        <Typography variant="h6" sx={{ fontSize: '0.9375rem', color: '#0B2545' }}>{title}</Typography>
        {action}
      </Box>
      <Box sx={{ p: noPadding ? 0 : 2 }}>{children}</Box>
    </Card>
  );
}
