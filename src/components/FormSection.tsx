import type { ReactNode } from 'react';
import { Box, Card, Typography } from '@mui/material';

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

/** Card with a tinted blue header band and a blue accent bar on the left. */
export default function FormSection({ title, subtitle, action, children }: Props) {
  return (
    <Card sx={{ mb: 2, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, pl: 2.5, pr: 2.5, py: 1.25, minHeight: 50, bgcolor: '#E9F0FB', borderBottom: '1px solid #D3E0F4', borderLeft: '4px solid #1D5FD1' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontSize: '0.9375rem', lineHeight: 1.3, color: '#0B2545' }}>{title}</Typography>
          {subtitle && <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: '#5B6B82' }}>{subtitle}</Typography>}
        </Box>
        {action}
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Card>
  );
}
