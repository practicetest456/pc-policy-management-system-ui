import { Box, Button, Card, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddIcon from '@mui/icons-material/Add';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import EditNoteOutlined from '@mui/icons-material/EditNoteOutlined';
import GavelOutlined from '@mui/icons-material/GavelOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import PeopleOutline from '@mui/icons-material/PeopleOutline';
import SendOutlined from '@mui/icons-material/SendOutlined';
import { dashboardApi } from '../../api';
import CurrencyDisplay from '../../components/CurrencyDisplay';
import DataTable from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageHeader from '../../components/PageHeader';
import SectionCard from '../../components/SectionCard';
import StatusChip, { statusColor } from '../../components/StatusChip';
import SummaryCard from '../../components/SummaryCard';
import { useFetch } from '../../hooks/useFetch';
import type { PolicySummary, QuoteSummary } from '../../types';
import { formatCurrency, prettify } from '../../utils/format';

const quoteColumns: Column<QuoteSummary>[] = [
  { header: 'Quote #', render: (q) => <strong>{q.quoteNumber}</strong> },
  { header: 'Customer', render: (q) => q.businessName },
  { header: 'Status', render: (q) => <StatusChip status={q.status} /> },
  { header: 'Premium', align: 'right', render: (q) => <CurrencyDisplay value={q.totalAnnualPremium} /> },
];

const policyColumns: Column<PolicySummary>[] = [
  { header: 'Policy #', render: (p) => <strong>{p.policyNumber}</strong> },
  { header: 'Customer', render: (p) => p.businessName },
  { header: 'Status', render: (p) => <StatusChip status={p.status} /> },
  { header: 'Balance', align: 'right', render: (p) => <CurrencyDisplay value={p.outstandingBalance} /> },
];

const viewAll = (to: string) => (
  <Button size="small" component={RouterLink} to={to} sx={{ fontSize: '0.8125rem' }}>View all</Button>
);

export default function CommercialAutoDashboard() {
  const navigate = useNavigate();
  const summary = useFetch(dashboardApi.summary);
  const quotes = useFetch(dashboardApi.recentQuotes);
  const policies = useFetch(dashboardApi.recentPolicies);

  if (summary.loading && !summary.data) return <LoadingSpinner label="Loading dashboard…" />;
  if (summary.error || !summary.data) {
    return <ErrorAlert message={summary.error ?? 'Dashboard data is not available'} onRetry={summary.reload} />;
  }
  const s = summary.data;
  const totalQuotes = s.quotesByStatus.reduce((sum, q) => sum + q.count, 0);
  const totalClaims = s.claimsByStatus.reduce((sum, c) => sum + c.count, 0);
  const claimSlices = s.claimsByStatus.filter((c) => c.count > 0);

  return (
    <>
      <PageHeader title="Commercial Auto Dashboard" description="Live numbers from the Commercial Auto database." />

      {/* KPI cards */}
      <Box sx={{ display: 'grid', gap: 1.5, mb: 1.5, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, '@media (min-width:1380px)': { gridTemplateColumns: 'repeat(6, 1fr)' } }}>
        <SummaryCard label="Total Customers" value={s.totalCustomers} icon={<PeopleOutline />} color="#1D5FBF" to="/commercial-auto/customers" />
        <SummaryCard label="Draft Quotes" value={s.draftQuotes} icon={<EditNoteOutlined />} color="#4B5D78" to="/commercial-auto/quotes" />
        <SummaryCard label="Submitted Quotes" value={s.submittedQuotes} icon={<SendOutlined />} color="#D9730D" to="/commercial-auto/quotes" />
        <SummaryCard label="Active Policies" value={s.activePolicies} icon={<AssignmentOutlined />} color="#17803D" to="/commercial-auto/policies" />
        <SummaryCard label="Open Claims" value={s.openClaims} icon={<GavelOutlined />} color="#C0362C" to="/commercial-auto/claims" />
        <SummaryCard label="Outstanding Payments" value={formatCurrency(s.outstandingPayments)} icon={<AccountBalanceWalletOutlined />} color="#6B4FBB" to="/commercial-auto/payments" />
      </Box>

      {/* Quick actions: one slim bar */}
      <Card sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', px: 2, py: 1.25, mb: 1.5, bgcolor: '#FBFCFE' }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'text.secondary', mr: 1 }}>QUICK ACTIONS</Typography>
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/commercial-auto/customers/new')}>New Customer</Button>
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/commercial-auto/quotes/new')}>New Quote</Button>
        <Button size="small" variant="outlined" startIcon={<AssignmentOutlined />} component={RouterLink} to="/commercial-auto/policies">View Policies</Button>
        <Button size="small" variant="outlined" startIcon={<GavelOutlined />} component={RouterLink} to="/commercial-auto/claims/new">File Claim</Button>
        <Button size="small" variant="outlined" startIcon={<PaymentsOutlined />} component={RouterLink} to="/commercial-auto/payments/new">Record Payment</Button>
      </Card>

      {/* Charts */}
      <Box sx={{ display: 'grid', gap: 1.5, mb: 1.5, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <SectionCard title="Quotes by Status" action={<Typography variant="caption" color="text.secondary">{totalQuotes} total</Typography>}>
          <Box sx={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.quotesByStatus.map((q) => ({ name: prettify(q.status), status: q.status, count: q.count }))} margin={{ top: 18, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF3" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <YAxis hide allowDecimals={false} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="count" name="Quotes" radius={[5, 5, 0, 0]} maxBarSize={44} isAnimationActive={false}>
                  {s.quotesByStatus.map((q) => <Cell key={q.status} fill={statusColor(q.status)} />)}
                  <LabelList dataKey="count" position="top" style={{ fontSize: 12, fontWeight: 600, fill: '#334155' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </SectionCard>

        <SectionCard title="Claims by Status" action={<Typography variant="caption" color="text.secondary">{totalClaims} total</Typography>}>
          {claimSlices.length === 0 ? (
            <Box sx={{ height: 190, display: 'grid', placeItems: 'center' }}>
              <EmptyState title="No claims yet" message="Claims will appear here once they are filed." />
            </Box>
          ) : (
            <Box sx={{ height: 190, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={claimSlices.map((c) => ({ name: prettify(c.status), status: c.status, value: c.count }))} dataKey="value" nameKey="name" innerRadius={54} outerRadius={80} paddingAngle={claimSlices.length > 1 ? 2 : 0} stroke="none" isAnimationActive={false}>
                      {claimSlices.map((c) => <Cell key={c.status} fill={statusColor(c.status)} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none', textAlign: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{totalClaims}</Typography>
                    <Typography variant="caption" color="text.secondary">claims</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 2, rowGap: 0.75 }}>
                {s.claimsByStatus.map((c) => (
                  <Box key={c.status} sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: c.count === 0 ? 0.45 : 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: statusColor(c.status), flexShrink: 0 }} />
                    <Typography noWrap sx={{ fontSize: '0.8125rem', flexGrow: 1 }}>{prettify(c.status)}</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>{c.count}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </SectionCard>
      </Box>

      {/* Recent activity */}
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <SectionCard title="Recent Quotes" action={viewAll('/commercial-auto/quotes')} noPadding>
          <DataTable
            embedded columns={quoteColumns} rows={quotes.data} rowKey={(q) => q.id} loading={quotes.loading} error={quotes.error}
            onRetry={quotes.reload} onRowClick={(q) => navigate(`/commercial-auto/quotes/${q.id}`)}
            emptyTitle="No quotes yet" emptyMessage="Create a quote to get started."
            emptyAction={<Button variant="contained" component={RouterLink} to="/commercial-auto/quotes/new">New Quote</Button>}
          />
        </SectionCard>
        <SectionCard title="Recent Policies" action={viewAll('/commercial-auto/policies')} noPadding>
          <DataTable
            embedded columns={policyColumns} rows={policies.data} rowKey={(p) => p.id} loading={policies.loading} error={policies.error}
            onRetry={policies.reload} onRowClick={(p) => navigate(`/commercial-auto/policies/${p.id}`)}
            emptyTitle="No policies yet" emptyMessage="Bind an approved quote to create a policy."
          />
        </SectionCard>
      </Box>
    </>
  );
}
