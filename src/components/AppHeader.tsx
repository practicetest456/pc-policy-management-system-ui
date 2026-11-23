import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import { HEADER_HEIGHT } from '../theme';

interface Props {
  onMenuClick?: () => void;
  moduleName?: string;
}

export default function AppHeader({ onMenuClick, moduleName }: Props) {
  return (
    <AppBar
      position="fixed" elevation={0}
      sx={{ bgcolor: '#081C36', borderBottom: '3px solid #2E7BEF', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar disableGutters sx={{ minHeight: HEADER_HEIGHT, px: { xs: 1.5, md: 2.5 }, gap: 1.25 }}>
        {onMenuClick && (
          <IconButton color="inherit" edge="start" size="small" onClick={onMenuClick} sx={{ display: { md: 'none' } }} aria-label="Open menu">
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ width: 30, height: 30, borderRadius: '8px', display: 'grid', placeItems: 'center', bgcolor: '#1D5FD1' }}>
          <ShieldOutlined sx={{ fontSize: 19, color: '#fff' }} />
        </Box>
        <Typography noWrap sx={{ fontSize: '1rem', fontWeight: 700, letterSpacing: 0.1 }}>
          P&amp;C Policy Management System
        </Typography>
        {moduleName && (
          <>
            <Box sx={{ width: '1px', height: 18, bgcolor: 'rgba(255,255,255,0.22)', display: { xs: 'none', sm: 'block' } }} />
            <Typography noWrap sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.78)', display: { xs: 'none', sm: 'block' } }}>
              {moduleName}
            </Typography>
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}
