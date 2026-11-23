import { useState } from 'react';
import { Box, Button, Card, CardContent, LinearProgress, Tab, Tabs, Typography } from '@mui/material';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import SummaryCard from '../../../components/SummaryCard';
import { formatCurrency as money } from '../../../utils/format';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import GavelOutlined from '@mui/icons-material/GavelOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { claimApi, paymentApi, policyApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ConfirmDialog from '../../../components/ConfirmDialog';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import DataTable from '../../../components/DataTable';
import type { Column } from '../../../components/DataTable';
import ErrorAlert from '../../../components/ErrorAlert';
import FormGrid from '../../../components/FormGrid';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageHeader from '../../../components/PageHeader';
import { CoveragesList, DriversTable, InfoItem, VehiclesTable } from '../../../components/QuoteSections';
import StatusChip from '../../../components/StatusChip';
import { useNotify } from '../../../components/SuccessSnackbar';
import TextPromptDialog from '../../../components/TextPromptDialog';
import { useFetch } from '../../../hooks/useFetch';
import { useReferenceData } from '../../../hooks/useReferenceData';
import type { Claim, Payment } from '../../../types';
import { formatDate, formatDateTime, prettify } from '../../../utils/format';

const TABS = ['Overview', 'Customer', 'Vehicles', 'Drivers', 'Coverages', 'Payments', 'Claims'];

export default function PolicyDetail() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const notify = useNotify();
  const { data: reference } = useReferenceData();
  const policy = useFetch(() => policyApi.get(id), [id]);
  const payments = useFetch(() => paymentApi.list(id), [id]);
  const claims = useFetch(() => claimApi.list('', id), [id]);

  const [tab, setTab] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [toReverse, setToReverse] = useState<Payment | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (policy.loading && !policy.data) return <LoadingSpinner />;
  if (policy.error || !policy.data) return <ErrorAlert message={policy.error ?? 'Policy not found'} onRetry={policy.reload} />;
  const p = policy.data;
  const active = p.status === 'ACTIVE';

  const cancelPolicy = async (reason: string) => {
    setBusy(true);
    setActionError(null);
    try {
      await policyApi.cancel(id, reason.trim());
      notify('Policy cancelled');
      policy.reload();
    } catch (err) {
      setActionError(parseApiError(err).message);
    } finally {
      setBusy(false);
      setCancelOpen(false);
    }
  };

  const reversePayment = async () => {
    if (!toReverse) return;
    setBusy(true);
    setActionError(null);
    try {
      await paymentApi.reverse(toReverse.id);
      notify(`Payment ${toReverse.paymentNumber} reversed`);
      policy.reload();
      payments.reload();
    } catch (err) {
      setActionError(parseApiError(err).message);
    } finally {
      setBusy(false);
      setToReverse(null);
    }
  };

  const paymentColumns: Column<Payment>[] = [
    { header: 'Payment #', render: (x) => x.paymentNumber },
    { header: 'Date', render: (x) => formatDate(x.paymentDate) },
    { header: 'Method', render: (x) => prettify(x.paymentMethod) },
    { header: 'Reference', render: (x) => x.referenceNumber ?? '—' },
    { header: 'Amount', align: 'right', render: (x) => <CurrencyDisplay value={x.amount} /> },
    { header: 'Status', render: (x) => <StatusChip status={x.status} /> },
    {
      header: 'Actions', align: 'right',
      render: (x) => x.status === 'COMPLETED' ? <Button size="small" color="error" onClick={() => setToReverse(x)}>Reverse</Button> : null,
    },
  ];

  const claimColumns: Column<Claim>[] = [
    { header: 'Claim #', render: (x) => x.claimNumber },
    { header: 'Accident Date', render: (x) => formatDate(x.accidentDate) },
    { header: 'Vehicle', render: (x) => x.vehicleDescription },
    { header: 'Driver', render: (x) => x.driverName },
    { header: 'Estimated', align: 'right', render: (x) => <CurrencyDisplay value={x.estimatedDamage} /> },
    { header: 'Status', render: (x) => <StatusChip status={x.status} /> },
  ];

  const c = p.customer;

  return (
    <>
      <PageHeader
        title={p.policyNumber}
        description={`${c.businessName} · from quote ${p.quoteNumber}`}
        chip={<StatusChip status={p.status} />}
        actions={
          <>
            <Button variant="contained" startIcon={<PaymentsOutlined />} disabled={!active} component={RouterLink} to={`/commercial-auto/payments/new?policyId=${p.id}`}>Record Payment</Button>
            <Button variant="outlined" startIcon={<GavelOutlined />} disabled={!active} component={RouterLink} to={`/commercial-auto/claims/new?policyId=${p.id}`}>File Claim</Button>
            <Button variant="outlined" color="error" startIcon={<CancelOutlined />} disabled={!active} onClick={() => setCancelOpen(true)}>Cancel Policy</Button>
          </>
        }
      />
      <ErrorAlert message={actionError} />

      <Box sx={{ display: 'grid', gap: 1.5, mb: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
        <SummaryCard label="Annual Premium" value={money(p.annualPremium)} icon={<ShieldOutlined />} color="#1D5FD1" />
        <SummaryCard label="Paid to Date" value={money(p.paidAmount)} icon={<CheckCircleOutline />} color="#17803D" />
        <SummaryCard label="Outstanding Balance" value={money(p.outstandingBalance)} icon={<AccountBalanceWalletOutlined />} color={p.outstandingBalance > 0 ? '#D9730D' : '#17803D'} />
      </Box>
      <Card sx={{ px: 2.5, py: 1.5, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', color: '#6B7C95' }}>PREMIUM PAID</Typography>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0B2545' }}>{p.annualPremium > 0 ? Math.round((p.paidAmount / p.annualPremium) * 100) : 0}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={p.annualPremium > 0 ? Math.min(100, (p.paidAmount / p.annualPremium) * 100) : 0} sx={{ height: 8, borderRadius: 4, bgcolor: '#E6EDF8', '& .MuiLinearProgress-bar': { bgcolor: '#17803D', borderRadius: 4 } }} />
      </Card>

      <Card>
        <Tabs value={tab} onChange={(_, value: number) => setTab(value)} variant="scrollable" scrollButtons="auto" sx={{ m: 1.5 }}>
          {TABS.map((label) => <Tab key={label} label={label} />)}
        </Tabs>
        <CardContent sx={{ p: 3 }}>
          {tab === 0 && (
            <FormGrid columns={3}>
              <InfoItem label="Policy Number">{p.policyNumber}</InfoItem>
              <InfoItem label="Quote Number"><RouterLink to={`/commercial-auto/quotes/${p.quoteId}`}>{p.quoteNumber}</RouterLink></InfoItem>
              <InfoItem label="Status"><StatusChip status={p.status} /></InfoItem>
              <InfoItem label="Effective Date">{formatDate(p.effectiveDate)}</InfoItem>
              <InfoItem label="Expiration Date">{formatDate(p.expirationDate)}</InfoItem>
              <InfoItem label="Created">{formatDateTime(p.createdAt)}</InfoItem>
              <InfoItem label="Annual Premium"><CurrencyDisplay value={p.annualPremium} fontWeight={600} /></InfoItem>
              <InfoItem label="Paid Amount"><CurrencyDisplay value={p.paidAmount} fontWeight={600} color="success.main" /></InfoItem>
              <InfoItem label="Outstanding Balance"><CurrencyDisplay value={p.outstandingBalance} fontWeight={600} color={p.outstandingBalance > 0 ? 'warning.main' : 'success.main'} /></InfoItem>
              {p.status === 'CANCELLED' && <InfoItem label="Cancelled">{formatDateTime(p.cancelledAt)}</InfoItem>}
              {p.status === 'CANCELLED' && <InfoItem label="Cancellation Reason">{p.cancellationReason}</InfoItem>}
            </FormGrid>
          )}
          {tab === 1 && (
            <FormGrid columns={3}>
              <InfoItem label="Business"><RouterLink to={`/commercial-auto/customers/${c.id}`}>{c.businessName}</RouterLink> ({c.customerNumber})</InfoItem>
              <InfoItem label="Business Type">{prettify(c.businessType)}</InfoItem>
              <InfoItem label="Contact">{c.contactFirstName} {c.contactLastName}</InfoItem>
              <InfoItem label="Email">{c.email}</InfoItem>
              <InfoItem label="Phone">{c.phone}</InfoItem>
              <InfoItem label="Address">{c.addressLine1}{c.addressLine2 ? `, ${c.addressLine2}` : ''}, {c.city}, {reference?.stateName(c.state) ?? c.state} {c.zipCode}</InfoItem>
            </FormGrid>
          )}
          {tab === 2 && <VehiclesTable vehicles={p.vehicles} />}
          {tab === 3 && <DriversTable drivers={p.drivers} />}
          {tab === 4 && <Box sx={{ maxWidth: 520 }}><CoveragesList coverages={p.coverages} /></Box>}
          {tab === 5 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Payments recorded against this policy.</Typography>
              <DataTable
                columns={paymentColumns} rows={payments.data} rowKey={(x) => x.id} loading={payments.loading} error={payments.error} onRetry={payments.reload}
                emptyTitle="No payments yet" emptyMessage={active ? 'Use “Record Payment” to add the first payment.' : 'This policy is not active.'}
              />
            </>
          )}
          {tab === 6 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Claims filed against this policy.</Typography>
              <DataTable
                columns={claimColumns} rows={claims.data} rowKey={(x) => x.id} loading={claims.loading} error={claims.error} onRetry={claims.reload}
                onRowClick={(x) => navigate(`/commercial-auto/claims/${x.id}`)}
                emptyTitle="No claims" emptyMessage="No claims have been filed on this policy."
              />
            </>
          )}
        </CardContent>
      </Card>

      <TextPromptDialog
        open={cancelOpen} title="Cancel policy" danger required label="Cancellation reason" confirmLabel="Cancel Policy"
        message="The policy will stop accepting payments and claims. Existing payments are not refunded automatically."
        loading={busy} onConfirm={cancelPolicy} onCancel={() => setCancelOpen(false)}
      />
      <ConfirmDialog
        open={!!toReverse} danger confirmLabel="Reverse Payment" title="Reverse payment?" loading={busy}
        message={`This reverses ${toReverse?.paymentNumber ?? 'the payment'} and adds the amount back to the outstanding balance. A payment can only be reversed once.`}
        onConfirm={reversePayment} onCancel={() => setToReverse(null)}
      />
    </>
  );
}
