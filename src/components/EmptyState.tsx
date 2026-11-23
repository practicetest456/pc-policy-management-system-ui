import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import InboxOutlined from '@mui/icons-material/InboxOutlined';

interface Props {
  title: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, message, action }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: 5, px: 2 }}>
      <Box sx={{ width: 44, height: 44, mx: 'auto', mb: 1.25, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: '#EEF2F7', color: '#94A3B8' }}>
        <InboxOutlined />
      </Box>
      <Typography variant="subtitle1">{title}</Typography>
      {message && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{message}</Typography>}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}
