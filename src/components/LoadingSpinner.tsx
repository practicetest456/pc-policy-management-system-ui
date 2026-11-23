import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, gap: 1.5 }}>
      <CircularProgress size={28} thickness={4} />
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  );
}
