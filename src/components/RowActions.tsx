import type { ReactNode } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

export interface RowAction {
  title: string;
  icon: ReactNode;
  onClick: () => void;
  /** Only destructive actions (Delete) are red. */
  danger?: boolean;
}

/** Small icon buttons in one horizontal row. View/Edit are neutral, Delete is red. */
export default function RowActions({ actions }: { actions: RowAction[] }) {
  return (
    <Box sx={{ display: 'inline-flex', gap: 0.25, verticalAlign: 'middle' }}>
      {actions.map((action) => (
        <Tooltip key={action.title} title={action.title}>
          <IconButton
            size="small"
            aria-label={action.title}
            onClick={(event) => {
              event.stopPropagation();
              action.onClick();
            }}
            sx={{
              width: 30, height: 30, borderRadius: '7px', color: action.danger ? 'error.main' : 'text.secondary',
              '& svg': { fontSize: 18 },
              '&:hover': { bgcolor: action.danger ? '#FDECEA' : '#E8F0FB', color: action.danger ? 'error.main' : 'primary.main' },
            }}
          >
            {action.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}
