import type { ReactNode } from 'react';
import { Box } from '@mui/material';

/** Row that holds the search box and filters above a table. */
export default function ListToolbar({ children }: { children: ReactNode }) {
  return <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>{children}</Box>;
}
