import { Chip } from '@mui/material';
import { prettify } from '../utils/format';

// Solid filled badges: green = active/success, amber = pending/review, red = rejected/cancelled, purple = bound.
const GREEN = { bg: '#1E9E55', fg: '#FFFFFF' };
const AMBER = { bg: '#F5B301', fg: '#3B2A00' };
const RED = { bg: '#D64545', fg: '#FFFFFF' };
const PURPLE = { bg: '#6B4FBB', fg: '#FFFFFF' };
const SLATE = { bg: '#64748B', fg: '#FFFFFF' };

const COLORS: Record<string, { bg: string; fg: string }> = {
  ACTIVE: GREEN, APPROVED: GREEN, COMPLETED: GREEN, PAID: GREEN,
  SUBMITTED: AMBER, OPEN: AMBER, UNDER_REVIEW: AMBER,
  REJECTED: RED, CANCELLED: RED, REVERSED: RED, EXPIRED: RED,
  BOUND: PURPLE,
  DRAFT: SLATE, CLOSED: SLATE,
};

const CHART_COLORS: Record<string, string> = {
  ACTIVE: '#2F9E5B', APPROVED: '#2F9E5B', COMPLETED: '#2F9E5B', PAID: '#2F9E5B',
  SUBMITTED: '#F0A030', OPEN: '#F0A030', UNDER_REVIEW: '#F0A030',
  REJECTED: '#E05A4F', CANCELLED: '#E05A4F', REVERSED: '#E05A4F', EXPIRED: '#E05A4F',
  BOUND: '#7C5CD6', DRAFT: '#94A3B8', CLOSED: '#64748B',
};

/** Chart colour for a status (same colour families as the badges). */
export function statusColor(status: string): string {
  return CHART_COLORS[status] ?? '#94A3B8';
}

export default function StatusChip({ status }: { status: string }) {
  const color = COLORS[status] ?? SLATE;
  return (
    <Chip
      label={prettify(status)}
      size="small"
      sx={{ height: 22, bgcolor: color.bg, color: color.fg, fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '6px', '& .MuiChip-label': { px: 1.1 } }}
    />
  );
}
