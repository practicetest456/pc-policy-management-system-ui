import type { ReactNode } from 'react';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  to?: string;
  hint?: string;
}

/** Filled KPI tile: coloured gradient background, white label and a big white number. */
export default function SummaryCard({ label, value, icon, color = '#1D5FD1', to, hint }: Props) {
  const content = (
    <Box sx={{ position: 'relative', px: 1.75, py: 1.5, minHeight: 92 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', lineHeight: 1.25 }}>{label}</Typography>
        <Box sx={{ width: 28, height: 28, flexShrink: 0, borderRadius: '8px', display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.22)', '& svg': { fontSize: 17 } }}>
          {icon}
        </Box>
      </Box>
      <Typography noWrap title={String(value)} sx={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2, mt: 0.75, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
      {hint && <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{hint}</Typography>}
    </Box>
  );
  return (
    <Card
      sx={{
        border: 0, color: '#fff', position: 'relative', overflow: 'hidden', background: color,
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(0,0,0,0.16) 100%)',
        boxShadow: '0 4px 12px rgba(11,37,69,0.18)', transition: 'transform .15s, box-shadow .15s',
        '&::after': { content: '""', position: 'absolute', right: -24, bottom: -34, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' },
        '&:hover': to ? { transform: 'translateY(-2px)', boxShadow: '0 8px 18px rgba(11,37,69,0.28)' } : undefined,
      }}
    >
      {to ? <CardActionArea component={RouterLink} to={to} sx={{ color: 'inherit' }}>{content}</CardActionArea> : content}
    </Card>
  );
}
