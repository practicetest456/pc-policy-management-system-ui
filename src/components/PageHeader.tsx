import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
  chip?: ReactNode;
}

/** Filled navy banner: white title and description on the left, actions on the right. */
export default function PageHeader({ title, description, actions, chip }: Props) {
  return (
    <Box
      sx={{
        position: 'relative', overflow: 'hidden', borderRadius: '12px', mb: 2.5, px: { xs: 2, md: 3 }, py: 2.25,
        display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between',
        flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, color: '#fff',
        background: 'linear-gradient(100deg, #0B2545 0%, #12376B 55%, #1D5FD1 100%)',
        boxShadow: '0 4px 14px rgba(11,37,69,0.22)',
        '&::after': { content: '""', position: 'absolute', right: -60, top: -80, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' },
        '& .MuiButton-containedPrimary': { bgcolor: '#fff', color: NAVY_TEXT, '&:hover': { bgcolor: '#E6EFFD' } },
        '& .MuiButton-outlinedPrimary': { color: '#fff', borderColor: 'rgba(255,255,255,0.6)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', borderColor: '#fff' } },
        '& .MuiButton-outlinedError': { color: '#FFB4AB', borderColor: '#FFB4AB', '&:hover': { bgcolor: 'rgba(255,180,171,0.14)', borderColor: '#FFB4AB' } },
        '& .MuiButton-root.Mui-disabled': { color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.25)', bgcolor: 'transparent' },
      }}
    >
      <Box sx={{ minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          <Typography variant="h5" component="h1" sx={{ fontSize: { xs: '1.375rem', md: '1.625rem' }, color: '#fff', lineHeight: 1.25 }}>
            {title}
          </Typography>
          {chip}
        </Box>
        {description && <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.8)' }}>{description}</Typography>}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>{actions}</Box>}
    </Box>
  );
}

const NAVY_TEXT = '#0B2545';
