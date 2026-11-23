import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlined from '@mui/icons-material/EditOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { quoteApi } from '../../../api';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import DataTable from '../../../components/DataTable';
import type { Column } from '../../../components/DataTable';
import FilterSelect from '../../../components/FilterSelect';
import ListToolbar from '../../../components/ListToolbar';
import PageHeader from '../../../components/PageHeader';
import RowActions from '../../../components/RowActions';
import SearchField from '../../../components/SearchField';
import StatusChip from '../../../components/StatusChip';
import { useDebounced, useFetch } from '../../../hooks/useFetch';
import type { QuoteStatus, QuoteSummary } from '../../../types';
import { formatDate, prettify } from '../../../utils/format';

const STATUSES: QuoteStatus[] = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'BOUND'];

export default function QuoteList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<QuoteStatus | ''>('');
  const debouncedSearch = useDebounced(search);
  const { data, loading, error, reload } = useFetch(() => quoteApi.list(status, debouncedSearch), [status, debouncedSearch]);

  const columns: Column<QuoteSummary>[] = [
    { header: 'Quote #', render: (q) => <strong>{q.quoteNumber}</strong>, width: 110 },
    { header: 'Customer', render: (q) => q.businessName, minWidth: 170, wrap: true },
    { header: 'Status', render: (q) => <StatusChip status={q.status} /> },
    { header: 'Effective', render: (q) => formatDate(q.effectiveDate) },
    { header: 'Expiration', render: (q) => formatDate(q.expirationDate) },
    { header: 'Annual Premium', align: 'right', render: (q) => <CurrencyDisplay value={q.totalAnnualPremium} /> },
    {
      header: 'Actions', align: 'right', width: 90,
      render: (q) => (
        <RowActions
          actions={[
            { title: 'View', icon: <VisibilityOutlined />, onClick: () => navigate(`/commercial-auto/quotes/${q.id}`) },
            ...(q.status === 'DRAFT'
              ? [{ title: 'Edit draft', icon: <EditOutlined />, onClick: () => navigate(`/commercial-auto/quotes/${q.id}/edit`) }]
              : []),
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Quotes"
        description="Create, review and bind Commercial Auto quotes."
        actions={<Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/commercial-auto/quotes/new">New Quote</Button>}
      />
      <ListToolbar>
        <SearchField value={search} onChange={setSearch} placeholder="Search by quote # or customer" />
        <FilterSelect
          label="Status" value={status} onChange={(v) => setStatus(v as QuoteStatus | '')}
          options={STATUSES.map((s) => ({ value: s, label: prettify(s) }))}
        />
      </ListToolbar>
      <DataTable
        columns={columns} rows={data} rowKey={(q) => q.id} loading={loading} error={error} onRetry={reload}
        onRowClick={(q) => navigate(`/commercial-auto/quotes/${q.id}`)}
        emptyTitle="No quotes found" emptyMessage={debouncedSearch || status ? 'Try changing the search or filter.' : 'Create your first Commercial Auto quote.'}
        emptyAction={!debouncedSearch && !status && <Button variant="contained" component={RouterLink} to="/commercial-auto/quotes/new">New Quote</Button>}
      />
    </>
  );
}
