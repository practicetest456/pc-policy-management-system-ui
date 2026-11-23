import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavigateNext from '@mui/icons-material/NavigateNext';

const LABELS: Record<string, string> = {
  'commercial-auto': 'Commercial Auto',
  customers: 'Customers',
  quotes: 'Quotes',
  policies: 'Policies',
  payments: 'Payments',
  claims: 'Claims',
  edit: 'Edit',
};

const SINGULAR: Record<string, string> = {
  customers: 'Customer', quotes: 'Quote', policies: 'Policy', payments: 'Payment', claims: 'Claim',
};

/** Main Apps / Commercial Auto / Quotes / New Quote - built from the URL. */
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  const crumbs = [{ label: 'Main Apps', to: '/' }];
  let path = '';
  parts.forEach((part, index) => {
    path += `/${part}`;
    let label = LABELS[part];
    if (!label && part === 'new') label = `New ${SINGULAR[parts[index - 1]] ?? ''}`.trim();
    if (!label && /^\d+$/.test(part)) label = 'Details';
    crumbs.push({ label: label ?? part, to: path });
  });

  return (
    <MuiBreadcrumbs separator={<NavigateNext sx={{ fontSize: 16, color: '#94A3B8' }} />} sx={{ mb: 1.5 }}>
      {crumbs.map((crumb, index) =>
        index === crumbs.length - 1 ? (
          <Typography key={crumb.to} sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 600 }}>{crumb.label}</Typography>
        ) : (
          <Link key={crumb.to} component={RouterLink} to={crumb.to} underline="hover" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            {crumb.label}
          </Link>
        ),
      )}
    </MuiBreadcrumbs>
  );
}
