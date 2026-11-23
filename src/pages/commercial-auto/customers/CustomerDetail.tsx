import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { customerApi, quoteApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ConfirmDialog from '../../../components/ConfirmDialog';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import DataTable from '../../../components/DataTable';
import type { Column } from '../../../components/DataTable';
import ErrorAlert from '../../../components/ErrorAlert';
import FormGrid from '../../../components/FormGrid';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageHeader from '../../../components/PageHeader';
import { InfoItem } from '../../../components/QuoteSections';
import StatusChip from '../../../components/StatusChip';
import { useNotify } from '../../../components/SuccessSnackbar';
import { useFetch } from '../../../hooks/useFetch';
import { useReferenceData } from '../../../hooks/useReferenceData';
import type { QuoteSummary } from '../../../types';
import { formatDate, formatDateTime, prettify } from '../../../utils/format';

export default function CustomerDetail() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const notify = useNotify();
  const { data: reference } = useReferenceData();
  const customer = useFetch(() => customerApi.get(id), [id]);
  const quotes = useFetch(async () => {
    const c = await customerApi.get(id);
    const found = await quoteApi.list('', c.businessName);
    return found.filter((q) => q.customerId === id);
  }, [id]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (customer.loading && !customer.data) return <LoadingSpinner />;
  if (customer.error || !customer.data) return <ErrorAlert message={customer.error ?? 'Customer not found'} onRetry={customer.reload} />;
  const c = customer.data;

  const remove = async () => {
    setDeleting(true);
    try {
      await customerApi.remove(c.id);
      notify(`${c.businessName} was deleted`);
      navigate('/commercial-auto/customers');
    } catch (err) {
      setActionError(parseApiError(err).message);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<QuoteSummary>[] = [
    { header: 'Quote #', render: (q) => q.quoteNumber },
    { header: 'Status', render: (q) => <StatusChip status={q.status} /> },
    { header: 'Effective', render: (q) => formatDate(q.effectiveDate) },
    { header: 'Premium', align: 'right', render: (q) => <CurrencyDisplay value={q.totalAnnualPremium} /> },
  ];

  return (
    <>
      <PageHeader
        title={c.businessName}
        description={`${c.customerNumber} · ${prettify(c.businessType)}`}
        actions={
          <>
            <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to={`/commercial-auto/quotes/new?customerId=${c.id}`}>New Quote</Button>
            <Button variant="outlined" startIcon={<EditOutlined />} component={RouterLink} to={`/commercial-auto/customers/${c.id}/edit`}>Edit</Button>
            <Button variant="outlined" color="error" startIcon={<DeleteOutline />} onClick={() => setConfirmDelete(true)}>Delete</Button>
          </>
        }
      />
      <ErrorAlert message={actionError} />

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <FormGrid columns={4}>
            <InfoItem label="Contact">{c.contactFirstName} {c.contactLastName}</InfoItem>
            <InfoItem label="Email">{c.email}</InfoItem>
            <InfoItem label="Phone">{c.phone}</InfoItem>
            <InfoItem label="Created">{formatDateTime(c.createdAt)}</InfoItem>
            <InfoItem label="Address">
              {c.addressLine1}{c.addressLine2 ? `, ${c.addressLine2}` : ''}<br />
              {c.city}, {reference?.stateName(c.state) ?? c.state} {c.zipCode}
            </InfoItem>
            <InfoItem label="Years in Business">{c.yearsInBusiness}</InfoItem>
            <InfoItem label="Employees">{c.numberOfEmployees}</InfoItem>
          </FormGrid>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 1.5 }}>Quotes</Typography>
      <Box>
        <DataTable
          columns={columns} rows={quotes.data} rowKey={(q) => q.id} loading={quotes.loading} error={quotes.error} onRetry={quotes.reload}
          onRowClick={(q) => navigate(`/commercial-auto/quotes/${q.id}`)}
          emptyTitle="No quotes for this customer" emptyMessage="Start a quote to insure this business's vehicles."
        />
      </Box>

      <ConfirmDialog
        open={confirmDelete} danger loading={deleting} confirmLabel="Delete" title="Delete customer?"
        message={`This will permanently delete ${c.businessName}. A customer that has quotes cannot be deleted.`}
        onConfirm={remove} onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
