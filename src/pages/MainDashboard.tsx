import { useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Button, Card, CardActionArea, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import BusinessCenterOutlined from '@mui/icons-material/BusinessCenterOutlined';
import DirectionsCarOutlined from '@mui/icons-material/DirectionsCarOutlined';
import EngineeringOutlined from '@mui/icons-material/EngineeringOutlined';
import FolderOpenOutlined from '@mui/icons-material/FolderOpenOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import LocalFireDepartmentOutlined from '@mui/icons-material/LocalFireDepartmentOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import OpenInNew from '@mui/icons-material/OpenInNew';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';

interface AppTile {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  /** Only tiles with a path are implemented. They open in a NEW browser tab. */
  path?: string;
}

const COMMERCIAL: AppTile[] = [
  { title: 'Workers Compensation', description: 'Medical and wage benefits for injured employees', icon: <EngineeringOutlined />, color: '#D9730D' },
  { title: 'Commercial Auto', description: 'Vehicles, drivers and liability for small businesses', icon: <LocalShippingOutlined />, color: '#1D5FD1', path: '/commercial-auto' },
  { title: 'Commercial Package', description: 'Property and liability combined for businesses', icon: <BusinessCenterOutlined />, color: '#0E8F8A' },
  { title: 'Business Owners', description: 'Bundled coverage for small business owners', icon: <StorefrontOutlined />, color: '#6B4FBB' },
];

const PERSONAL: AppTile[] = [
  { title: 'Personal Auto', description: 'Cars and trucks owned by individuals', icon: <DirectionsCarOutlined />, color: '#2F80ED' },
  { title: 'Dwelling Fire', description: 'Property coverage for rental and secondary homes', icon: <LocalFireDepartmentOutlined />, color: '#C0362C' },
  { title: 'Homeowners', description: 'Home and personal property protection', icon: <HomeOutlined />, color: '#17803D' },
];

const SHARED: AppTile[] = [
  { title: 'Receivables', description: 'Premium billing and collections', icon: <ReceiptLongOutlined />, color: '#4B5D78' },
  { title: 'Search', description: 'Find customers, policies and claims', icon: <SearchOutlined />, color: '#4B5D78' },
  { title: 'View Policies', description: 'Browse all Commercial Auto policies', icon: <FolderOpenOutlined />, color: '#1D5FD1', path: '/commercial-auto/policies' },
];

function Tile({ tile, onComingSoon }: { tile: AppTile; onComingSoon: (title: string) => void }) {
  const live = !!tile.path;

  const body = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box
          sx={{
            width: 42, height: 42, borderRadius: '11px', display: 'grid', placeItems: 'center', '& svg': { fontSize: 24 },
            bgcolor: live ? 'rgba(255,255,255,0.2)' : `${tile.color}1F`, color: live ? '#fff' : tile.color,
          }}
        >
          {tile.icon}
        </Box>
        {live ? (
          <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: '#22C55E', color: '#fff', fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em' }}>● LIVE</Box>
        ) : (
          <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: '#E7ECF4', color: '#5B6B82', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em' }}>COMING SOON</Box>
        )}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: live ? '#fff' : '#0B2545' }}>{tile.title}</Typography>
        <Typography sx={{ fontSize: '0.8125rem', mt: 0.25, lineHeight: 1.45, color: live ? 'rgba(255,255,255,0.85)' : '#5B6B82' }}>{tile.description}</Typography>
      </Box>
      {live && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: '0.8125rem', fontWeight: 700, color: '#fff' }}>
          Open in new tab <OpenInNew sx={{ fontSize: 15 }} />
        </Box>
      )}
    </Box>
  );

  return (
    <Card
      sx={{
        height: '100%', overflow: 'hidden', transition: 'transform .15s, box-shadow .15s',
        borderTop: live ? 0 : `4px solid ${tile.color}`,
        ...(live
          ? { border: 0, color: '#fff', background: 'linear-gradient(135deg, #0B2545 0%, #1D5FD1 100%)', boxShadow: '0 8px 20px rgba(29,95,209,0.35)', '&:hover': { transform: 'translateY(-3px)' } }
          : { '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(11,37,69,0.14)' } }),
      }}
    >
      {live ? (
        // target="_blank": the module opens in its own browser tab
        <CardActionArea component="a" href={tile.path} target="_blank" rel="noopener noreferrer" sx={{ height: '100%' }}>{body}</CardActionArea>
      ) : (
        <CardActionArea onClick={() => onComingSoon(tile.title)} sx={{ height: '100%' }}>{body}</CardActionArea>
      )}
    </Card>
  );
}

function Group({ label, tiles, onComingSoon }: { label: string; tiles: AppTile[]; onComingSoon: (title: string) => void }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
        <Box sx={{ width: 4, height: 18, borderRadius: 2, bgcolor: '#1D5FD1' }} />
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0B2545', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {tiles.map((tile) => <Tile key={tile.title} tile={tile} onComingSoon={onComingSoon} />)}
      </Box>
    </Box>
  );
}

export default function MainDashboard() {
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  return (
    <>
      <Box
        sx={{
          position: 'relative', overflow: 'hidden', borderRadius: '14px', mb: 3.5, px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 }, color: '#fff',
          background: 'linear-gradient(105deg, #0B2545 0%, #12376B 55%, #1D5FD1 100%)', boxShadow: '0 6px 18px rgba(11,37,69,0.25)',
          '&::before': { content: '""', position: 'absolute', right: -70, top: -90, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' },
          '&::after': { content: '""', position: 'absolute', right: 120, bottom: -120, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' },
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', color: '#9DBDF2' }}>PROPERTY &amp; CASUALTY</Typography>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.625rem', md: '2rem' }, color: '#fff', mt: 0.5 }}>Main Apps</Typography>
        <Typography sx={{ mt: 0.75, color: 'rgba(255,255,255,0.82)', maxWidth: 620, fontSize: '0.9375rem' }}>
          Choose an insurance product to begin. Commercial Auto is live and opens in a new tab.
        </Typography>
      </Box>

      <Group label="Commercial Lines" tiles={COMMERCIAL} onComingSoon={setComingSoon} />
      <Group label="Personal Lines" tiles={PERSONAL} onComingSoon={setComingSoon} />
      <Group label="Shared Tools" tiles={SHARED} onComingSoon={setComingSoon} />

      <Dialog open={!!comingSoon} onClose={() => setComingSoon(null)} maxWidth="xs" fullWidth>
        <Box sx={{ px: 3, pt: 2.5 }}><Typography variant="h6" sx={{ color: '#0B2545' }}>{comingSoon}</Typography></Box>
        <DialogContent sx={{ pt: 1 }}><Typography variant="body2" color="text.secondary">Module coming soon</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}><Button variant="contained" onClick={() => setComingSoon(null)}>OK</Button></DialogActions>
      </Dialog>
    </>
  );
}
