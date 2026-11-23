import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { paymentApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ConfirmDialog from '../../../components/ConfirmDialog';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import DataTable from '../../../components/DataTable';
import type { Column } from '../../../components/DataTable';
import ErrorAlert from '../../../components/ErrorAlert';
import FilterSelect from '../../../components/FilterSelect';
import ListToolbar from '../../../components/ListToolbar';
import PageHeader from '../../../components/PageHeader';
import SearchField from '../../../components/SearchField';
import StatusChip from '../../../components/StatusChip';
import { useNotify } from '../../../components/SuccessSnackbar';
import { useFetch } from '../../../hooks/useFetch';
import type { Payment, PaymentStatus } from '../../../types';
import { formatDate, prettify } from '../../../utils/format';

export default function PaymentList() {
  const navigate = useNavigate();
  const notify = useNotify();
  const { data, loading, error, reload } = useFetch(() => paymentApi.list(), []);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const [toReverse, setToReverse] = useState<Payment | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const text = search.trim().toLowerCase();
  const rows = (data ?? []).filter((p) =>
    (!status || p.status === status) &&
    (!text || [p.paymentNumber, p.policyNumber, p.businessName, p.referenceNumber ?? ''].some((v) => v.toLowerCase().includes(text))));

  const reverse = async () => {
    if (!toReverse) return;
    setBusy(true);
    setActionError(null);
    try {
      await paymentApi.reverse(toReverse.id);
      notify(`Payment ${toReverse.paymentNumber} reversed`);
      reload();
    } catch (err) {
      setActionError(parseApiError(err).message);
    } finally {
      setBusy(false);
      setToReverse(null);
    }
  };

  const columns: Column<Payment>[] = [
    { header: 'Payment #', render: (p) => <strong>{p.paymentNumber}</strong>, width: 110 },
    { header: 'Policy', render: (p) => p.policyNumber, minWidth: 130 },
    { header: 'Customer', render: (p) => p.businessName, minWidth: 170, wrap: true },
    { header: 'Date', render: (p) => formatDate(p.paymentDate) },
    { header: 'Method', render: (p) => prettify(p.paymentMethod) },
    { header: 'Reference', render: (p) => p.referenceNumber ?? '—' },
    { header: 'Amount', align: 'right', render: (p) => <CurrencyDisplay value={p.amount} /> },
    { header: 'Status', render: (p) => <StatusChip status={p.status} /> },
    {
      header: 'Actions', align: 'right', width: 90,
      render: (p) => p.status === 'COMPLETED'
        ? <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); setToReverse(p); }}>Reverse</Button>
        : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Payments"
        description="Payments are recorded manually. There is no payment gateway."
        actions={<Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/commercial-auto/payments/new">Record Payment</Button>}
      />
      <ListToolbar>
        <SearchField value={search} onChange={setSearch} placeholder="Search by payment #, policy, customer or reference" width={420} />
        <FilterSelect
          label="Status" value={status} onChange={(v) => setStatus(v as PaymentStatus | '')}
          options={[{ value: 'COMPLETED', label: 'Completed' }, { value: 'REVERSED', label: 'Reversed' }]}
        />
      </ListToolbar>
      <ErrorAlert message={actionError} />
      <DataTable
        columns={columns} rows={rows} rowKey={(p) => p.id} loading={loading} error={error} onRetry={reload}
        onRowClick={(p) => navigate(`/commercial-auto/policies/${p.policyId}`)}
        emptyTitle="No payments found" emptyMessage={search || status ? 'Try changing the search or filter.' : 'Record the first payment against an active policy.'}
      />
      <ConfirmDialog
        open={!!toReverse} danger confirmLabel="Reverse Payment" title="Reverse payment?" loading={busy}
        message={`This reverses ${toReverse?.paymentNumber ?? 'the payment'} and adds the amount back to the outstanding balance. A payment can only be reversed once.`}
        onConfirm={reverse} onCancel={() => setToReverse(null)}
      />
    </>
  );
}
