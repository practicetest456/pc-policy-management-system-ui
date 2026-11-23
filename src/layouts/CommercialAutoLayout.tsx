import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import Sidebar from '../components/Sidebar';
import { HEADER_HEIGHT } from '../theme';

/** Layout for the Commercial Auto module: header + left menu + breadcrumbs. */
export default function CommercialAutoLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppHeader onMenuClick={() => setMenuOpen(true)} moduleName="Commercial Auto" />
      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 1.5, sm: 2, md: 2.5 } }}>
        <Box sx={{ height: HEADER_HEIGHT - 8 }} />
        <Box sx={{ maxWidth: 1480, mx: 'auto' }}>
          <Breadcrumbs />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
