import { useState } from 'react';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import EventOutlined from '@mui/icons-material/EventOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import ReportProblemOutlined from '@mui/icons-material/ReportProblemOutlined';
import SummaryCard from '../../../components/SummaryCard';
import { claimApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ConfirmDialog from '../../../components/ConfirmDialog';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import ErrorAlert from '../../../components/ErrorAlert';
import FormGrid from '../../../components/FormGrid';
import FormSection from '../../../components/FormSection';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageHeader from '../../../components/PageHeader';
import { InfoItem } from '../../../components/QuoteSections';
import StatusChip from '../../../components/StatusChip';
import { useNotify } from '../../../components/SuccessSnackbar';
import TextPromptDialog from '../../../components/TextPromptDialog';
import { useFetch } from '../../../hooks/useFetch';
import type { ClaimStatus } from '../../../types';
import { formatCurrency, formatDate, formatDateTime, prettify } from '../../../utils/format';

type Action = 'review' | 'approve' | 'reject' | 'pay' | 'close' | null;

export default function ClaimDetail() {
  const id = Number(useParams().id);
  const notify = useNotify();
  const { data: claim, loading, error, reload } = useFetch(() => claimApi.get(id), [id]);
  const [action, setAction] = useState<Action>(null);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (loading && !claim) return <LoadingSpinner />;
  if (error || !claim) return <ErrorAlert message={error ?? 'Claim not found'} onRetry={reload} />;

  const move = async (newStatus: ClaimStatus, extra: { approvedAmount?: number; rejectionReason?: string } = {}) => {
    setBusy(true);
    setActionError(null);
    try {
      await claimApi.updateStatus(id, { newStatus, ...extra });
      notify(`Claim moved to ${prettify(newStatus)}`);
      reload();
      setAction(null);
    } catch (err) {
      setActionError(parseApiError(err).message);
      setAction(null);
    } finally {
      setBusy(false);
    }
  };

  const openApprove = () => {
    setApprovedAmount(String(claim.estimatedDamage));
    setAmountError(null);
    setAction('approve');
  };

  const confirmApprove = () => {
    const amount = Number(approvedAmount);
    if (!approvedAmount || Number.isNaN(amount) || amount <= 0) {
      setAmountError('Approved amount must be greater than zero');
    } else if (amount > claim.estimatedDamage) {
      setAmountError(`Approved amount cannot exceed the estimated damage of ${formatCurrency(claim.estimatedDamage)}`);
    } else {
      move('APPROVED', { approvedAmount: amount });
    }
  };

  return (
    <>
      <PageHeader
        title={claim.claimNumber}
        description={`${claim.businessName} · policy ${claim.policyNumber}`}
        chip={<StatusChip status={claim.status} />}
        actions={
          <>
            {claim.status === 'OPEN' && <Button variant="contained" onClick={() => setAction('review')}>Move to Under Review</Button>}
            {claim.status === 'UNDER_REVIEW' && <Button variant="contained" color="success" onClick={openApprove}>Approve</Button>}
            {claim.status === 'UNDER_REVIEW' && <Button variant="outlined" color="error" onClick={() => setAction('reject')}>Reject</Button>}
            {claim.status === 'APPROVED' && <Button variant="contained" onClick={() => setAction('pay')}>Mark as Paid</Button>}
            {(claim.status === 'PAID' || claim.status === 'REJECTED') && <Button variant="contained" onClick={() => setAction('close')}>Close Claim</Button>}
            <Button variant="outlined" component={RouterLink} to={`/commercial-auto/policies/${claim.policyId}`}>View Policy</Button>
          </>
        }
      />
      <ErrorAlert message={actionError} />

      <Box sx={{ display: 'grid', gap: 1.5, mb: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
        <SummaryCard label="Estimated Damage" value={formatCurrency(claim.estimatedDamage)} icon={<ReportProblemOutlined />} color="#D9730D" />
        <SummaryCard label="Approved Amount" value={claim.approvedAmount === null ? 'Pending' : formatCurrency(claim.approvedAmount)} icon={<PaidOutlined />} color="#17803D" />
        <SummaryCard label="Accident Date" value={formatDate(claim.accidentDate)} icon={<EventOutlined />} color="#1D5FD1" />
      </Box>

      <FormSection title="Accident">
        <FormGrid columns={3}>
          <InfoItem label="Accident Date">{formatDate(claim.accidentDate)}</InfoItem>
          <InfoItem label="Location">{claim.accidentLocation}</InfoItem>
          <InfoItem label="Police Report Number">{claim.policeReportNumber}</InfoItem>
          <InfoItem label="Vehicle">{claim.vehicleDescription}</InfoItem>
          <InfoItem label="Driver">{claim.driverName}</InfoItem>
          <InfoItem label="Filed">{formatDateTime(claim.createdAt)}</InfoItem>
          <InfoItem label="Description">{claim.description}</InfoItem>
          <InfoItem label="Notes">{claim.notes}</InfoItem>
        </FormGrid>
      </FormSection>

      <FormSection title="Amounts">
        <FormGrid columns={3}>
          <InfoItem label="Estimated Damage"><CurrencyDisplay value={claim.estimatedDamage} fontWeight={600} /></InfoItem>
          <InfoItem label="Approved Amount"><CurrencyDisplay value={claim.approvedAmount} fontWeight={600} color="success.main" /></InfoItem>
          {claim.rejectionReason && <InfoItem label="Rejection Reason">{claim.rejectionReason}</InfoItem>}
        </FormGrid>
      </FormSection>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Status History</Typography>
          {[...claim.history].reverse().map((h, index) => (
            <Box key={`${h.toStatus}-${h.changedAt}-${index}`} sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1, flexWrap: 'wrap', borderTop: index ? '1px solid #EAECF0' : 'none' }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 170 }}>{formatDateTime(h.changedAt)}</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 260 }}>
                {h.fromStatus ? <><StatusChip status={h.fromStatus} /> →</> : null}
                <StatusChip status={h.toStatus} />
              </Box>
              <Typography variant="body2">{h.note}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      <ConfirmDialog open={action === 'review'} title="Move to Under Review?" confirmLabel="Move" loading={busy}
        message="The claim will be reviewed before it is approved or rejected." onConfirm={() => move('UNDER_REVIEW')} onCancel={() => setAction(null)} />
      <ConfirmDialog open={action === 'pay'} title="Mark claim as paid?" confirmLabel="Mark as Paid" loading={busy}
        message={`Confirm that the approved amount of ${formatCurrency(claim.approvedAmount)} has been paid.`} onConfirm={() => move('PAID')} onCancel={() => setAction(null)} />
      <ConfirmDialog open={action === 'close'} title="Close claim?" confirmLabel="Close Claim" loading={busy}
        message="A closed claim cannot be changed again." onConfirm={() => move('CLOSED')} onCancel={() => setAction(null)} />
      <TextPromptDialog open={action === 'reject'} title="Reject claim" label="Rejection reason" required danger confirmLabel="Reject Claim"
        loading={busy} onConfirm={(reason) => move('REJECTED', { rejectionReason: reason.trim() })} onCancel={() => setAction(null)} />

      <Dialog open={action === 'approve'} onClose={busy ? undefined : () => setAction(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Approve claim</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>The approved amount cannot exceed the estimated damage of {formatCurrency(claim.estimatedDamage)}.</DialogContentText>
          <TextField
            autoFocus fullWidth type="number" label="Approved Amount ($)" value={approvedAmount}
            onChange={(e) => setApprovedAmount(e.target.value)} error={!!amountError} helperText={amountError ?? ' '}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAction(null)} disabled={busy}>Cancel</Button>
          <Button variant="contained" color="success" onClick={confirmApprove} disabled={busy}>{busy ? 'Working…' : 'Approve'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
