import type { ReactNode } from 'react';
import { Box } from '@mui/material';

/** Responsive form layout: 1 column on phones, 2 on tablets, optional 3/4 on wide screens. */
export default function FormGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
  return (
    <Box
      sx={{
        display: 'grid',
        columnGap: 2,
        rowGap: 2.25,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${columns}, 1fr)` },
      }}
    >
      {children}
    </Box>
  );
}
