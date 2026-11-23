import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import DirectionsCarOutlined from '@mui/icons-material/DirectionsCarOutlined';
import PeopleOutline from '@mui/icons-material/PeopleOutline';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import SummaryCard from '../../../components/SummaryCard';
import { formatCurrency as money } from '../../../utils/format';
import CalculateOutlined from '@mui/icons-material/CalculateOutlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import HighlightOff from '@mui/icons-material/HighlightOff';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { quoteApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ConfirmDialog from '../../../components/ConfirmDialog';
import ErrorAlert from '../../../components/ErrorAlert';
import FormGrid from '../../../components/FormGrid';
import FormSection from '../../../components/FormSection';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageHeader from '../../../components/PageHeader';
import { CoveragesList, DriversTable, InfoItem, PremiumPanel, VehiclesTable } from '../../../components/QuoteSections';
import StatusChip from '../../../components/StatusChip';
import { useNotify } from '../../../components/SuccessSnackbar';
import TextPromptDialog from '../../../components/TextPromptDialog';
import { useFetch } from '../../../hooks/useFetch';
import { useReferenceData } from '../../../hooks/useReferenceData';
import { formatDate, formatDateTime, prettify } from '../../../utils/format';

type Dialog = 'approve' | 'reject' | 'bind' | 'delete' | null;

export default function QuoteDetail() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const notify = useNotify();
  const { data: reference } = useReferenceData();
  const { data: quote, loading, error, reload } = useFetch(() => quoteApi.get(id), [id]);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (loading && !quote) return <LoadingSpinner />;
  if (error || !quote) return <ErrorAlert message={error ?? 'Quote not found'} onRetry={reload} />;

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(parseApiError(err).message);
    } finally {
      setBusy(false);
      setDialog(null);
    }
  };

  const calculate = () => run(async () => { await quoteApi.calculatePremium(id); notify('Premium calculated'); reload(); });
  const submit = () => run(async () => { await quoteApi.submit(id); notify('Quote submitted'); reload(); });
  const approve = (note: string) => run(async () => { await quoteApi.approve(id, note); notify('Quote approved'); reload(); });
  const reject = (note: string) => run(async () => { await quoteApi.reject(id, note); notify('Quote rejected'); reload(); });
  const bind = () => run(async () => {
    const policy = await quoteApi.bind(id);
    notify(`Policy ${policy.policyNumber} created`);
    navigate(`/commercial-auto/policies/${policy.id}`);
  });
  const remove = () => run(async () => { await quoteApi.remove(id); notify('Draft quote deleted'); navigate('/commercial-auto/quotes'); });

  const c = quote.customer;
  const draft = quote.status === 'DRAFT';

  return (
    <>
      <PageHeader
        title={quote.quoteNumber}
        description={`${c.businessName} · created ${formatDateTime(quote.createdAt)}`}
        chip={<StatusChip status={quote.status} />}
        actions={
          <>
            {draft && <Button variant="outlined" startIcon={<EditOutlined />} component={RouterLink} to={`/commercial-auto/quotes/${id}/edit`}>Edit</Button>}
            {draft && <Button variant="outlined" startIcon={<CalculateOutlined />} disabled={busy} onClick={calculate}>{quote.premium ? 'Recalculate Premium' : 'Calculate Premium'}</Button>}
            {draft && <Button variant="contained" startIcon={<SendOutlined />} disabled={busy || !quote.premium} onClick={submit}>Submit</Button>}
            {quote.status === 'SUBMITTED' && <Button variant="contained" color="success" startIcon={<CheckCircleOutline />} onClick={() => setDialog('approve')}>Approve</Button>}
            {quote.status === 'SUBMITTED' && <Button variant="outlined" color="error" startIcon={<HighlightOff />} onClick={() => setDialog('reject')}>Reject</Button>}
            {quote.status === 'APPROVED' && <Button variant="contained" startIcon={<LinkOutlined />} onClick={() => setDialog('bind')}>Bind &amp; Create Policy</Button>}
            {quote.status === 'BOUND' && quote.policyId && <Button variant="contained" component={RouterLink} to={`/commercial-auto/policies/${quote.policyId}`}>View Policy</Button>}
            {draft && <Button variant="outlined" color="error" startIcon={<DeleteOutline />} onClick={() => setDialog('delete')}>Delete</Button>}
          </>
        }
      />
      <ErrorAlert message={actionError} />

      <Box sx={{ display: 'grid', gap: 1.5, mb: 2, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
        <SummaryCard label="Annual Premium" value={quote.premium ? money(quote.premium.totalAnnualPremium) : 'Not calculated'} icon={<ShieldOutlined />} color="#1D5FD1" />
        <SummaryCard label="Vehicles" value={quote.vehicles.length} icon={<DirectionsCarOutlined />} color="#0E8F8A" />
        <SummaryCard label="Drivers" value={quote.drivers.length} icon={<PeopleOutline />} color="#6B4FBB" />
        <SummaryCard label="Coverages" value={quote.coverages.length} icon={<ShieldOutlined />} color="#D9730D" />
      </Box>

      <FormSection title="Business">
        <FormGrid columns={3}>
          <InfoItem label="Customer"><RouterLink to={`/commercial-auto/customers/${c.id}`}>{c.businessName}</RouterLink></InfoItem>
          <InfoItem label="Location">{c.city}, {reference?.stateName(c.state) ?? c.state}</InfoItem>
          <InfoItem label="Primary Operating State">{reference?.stateName(quote.primaryState) ?? quote.primaryState}</InfoItem>
          <InfoItem label="Policy Period">{formatDate(quote.effectiveDate)} – {formatDate(quote.expirationDate)}</InfoItem>
          <InfoItem label="Business Use">{quote.businessUse}</InfoItem>
          <InfoItem label="Business Description">{quote.businessDescription}</InfoItem>
        </FormGrid>
      </FormSection>

      <FormSection title={`Vehicles (${quote.vehicles.length})`}><VehiclesTable vehicles={quote.vehicles} /></FormSection>
      <FormSection title={`Drivers (${quote.drivers.length})`}><DriversTable drivers={quote.drivers} /></FormSection>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <FormSection title="Coverages"><CoveragesList coverages={quote.coverages} /></FormSection>
        <FormSection title="Premium">
          {quote.premium ? <PremiumPanel premium={quote.premium} /> : (
            <Typography color="text.secondary">Premium has not been calculated yet.</Typography>
          )}
        </FormSection>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Activity</Typography>
          {[...quote.activities].reverse().map((a, index) => (
            <Box key={`${a.action}-${a.createdAt}-${index}`} sx={{ display: 'flex', gap: 2, py: 1, borderTop: index ? '1px solid #EAECF0' : 'none' }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 170 }}>{formatDateTime(a.createdAt)}</Typography>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 170 }}>{prettify(a.action)}</Typography>
              <Typography variant="body2">{a.note}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      <TextPromptDialog
        open={dialog === 'approve'} title="Approve quote" label="Note (optional)" confirmLabel="Approve"
        loading={busy} onConfirm={approve} onCancel={() => setDialog(null)}
      />
      <TextPromptDialog
        open={dialog === 'reject'} title="Reject quote" label="Reason (optional)" confirmLabel="Reject" danger
        loading={busy} onConfirm={reject} onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'bind'} title="Bind quote?" confirmLabel="Bind & Create Policy" loading={busy}
        message="This creates an active policy from the approved quote. The quote can no longer be changed."
        onConfirm={bind} onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'delete'} title="Delete draft quote?" confirmLabel="Delete" danger loading={busy}
        message="This permanently deletes the draft quote and everything entered on it."
        onConfirm={remove} onCancel={() => setDialog(null)}
      />
    </>
  );
}
