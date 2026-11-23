import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h2" color="primary" fontWeight={700}>404</Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>Page not found</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">Back to Main Apps</Button>
    </Box>
  );
}
