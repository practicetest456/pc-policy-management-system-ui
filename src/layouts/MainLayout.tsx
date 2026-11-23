import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { HEADER_HEIGHT } from '../theme';

/** Layout for the main P&C dashboard: header only. */
export default function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppHeader />
      <Box sx={{ height: HEADER_HEIGHT }} />
      <Box component="main" sx={{ p: { xs: 2, md: 3 }, maxWidth: 1240, mx: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
