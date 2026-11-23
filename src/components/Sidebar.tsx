import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import GavelOutlined from '@mui/icons-material/GavelOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import PeopleOutline from '@mui/icons-material/PeopleOutline';
import RequestQuoteOutlined from '@mui/icons-material/RequestQuoteOutlined';
import { BLUE, HEADER_HEIGHT, NAVY } from '../theme';

const WIDTH = 232;

const ITEMS = [
  { label: 'Dashboard', to: '/commercial-auto', icon: <DashboardOutlined />, end: true },
  { label: 'Customers', to: '/commercial-auto/customers', icon: <PeopleOutline /> },
  { label: 'Quotes', to: '/commercial-auto/quotes', icon: <RequestQuoteOutlined /> },
  { label: 'Policies', to: '/commercial-auto/policies', icon: <AssignmentOutlined /> },
  { label: 'Payments', to: '/commercial-auto/payments', icon: <PaymentsOutlined /> },
  { label: 'Claims', to: '/commercial-auto/claims', icon: <GavelOutlined /> },
];

const itemSx = {
  borderRadius: '8px', mb: 0.5, py: 0.9, px: 1.5, color: '#C5D3EA',
  '& .MuiListItemIcon-root': { minWidth: 34, color: '#8FA7CC' },
  '& .MuiSvgIcon-root': { fontSize: 20 },
  '&:hover': { bgcolor: 'rgba(255,255,255,0.09)', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
};

interface Props {
  mobileOpen: boolean;
  onClose: () => void;
}

/** Dark navy navigation. The selected item is a solid blue pill. */
export default function Sidebar({ mobileOpen, onClose }: Props) {
  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: NAVY }}>
      <Box sx={{ height: HEADER_HEIGHT, flexShrink: 0 }} />
      <Typography sx={{ px: 2.75, pt: 2.5, pb: 1, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', color: '#7F95B5' }}>
        COMMERCIAL AUTO
      </Typography>
      <List sx={{ px: 1.5, py: 0, flexGrow: 1 }}>
        {ITEMS.map((item) => (
          <ListItemButton
            key={item.to} component={NavLink} to={item.to} end={item.end} onClick={onClose}
            sx={{
              ...itemSx,
              '&.active': {
                bgcolor: BLUE, color: '#fff', boxShadow: '0 3px 10px rgba(29,95,209,0.45)',
                '& .MuiListItemIcon-root': { color: '#fff' },
                '& .MuiListItemText-primary': { fontWeight: 700 },
              },
              '&.active:hover': { bgcolor: '#2A6DE3' },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { fontSize: '0.9rem', fontWeight: 500 } }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.12)', bgcolor: NAVY_DARK }}>
        <ListItemButton component={RouterLink} to="/" sx={{ ...itemSx, mb: 0 }}>
          <ListItemIcon><ArrowBack /></ListItemIcon>
          <ListItemText primary="Back to Main Apps" slotProps={{ primary: { fontSize: '0.9rem', fontWeight: 600 } }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary" open={mobileOpen} onClose={onClose} ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: WIDTH, bgcolor: NAVY, border: 0 } }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent" open
        sx={{ display: { xs: 'none', md: 'block' }, width: WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: WIDTH, bgcolor: NAVY, border: 0 } }}
      >
        {content}
      </Drawer>
    </>
  );
}

const NAVY_DARK = '#081C36';
