import { useState } from 'react';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import { policyApi } from '../../../api';
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
import type { PolicyStatus, PolicySummary } from '../../../types';
import { formatDate, prettify } from '../../../utils/format';

const STATUSES: PolicyStatus[] = ['ACTIVE', 'CANCELLED', 'EXPIRED'];

export default function PolicyList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PolicyStatus | ''>('');
  const debouncedSearch = useDebounced(search);
  const { data, loading, error, reload } = useFetch(() => policyApi.list(status, debouncedSearch), [status, debouncedSearch]);

  const columns: Column<PolicySummary>[] = [
    { header: 'Policy #', render: (p) => <strong>{p.policyNumber}</strong>, minWidth: 130 },
    { header: 'Customer', render: (p) => p.businessName, minWidth: 170, wrap: true },
    { header: 'Status', render: (p) => <StatusChip status={p.status} /> },
    { header: 'Policy Period', render: (p) => `${formatDate(p.effectiveDate)} – ${formatDate(p.expirationDate)}` },
    { header: 'Annual Premium', align: 'right', render: (p) => <CurrencyDisplay value={p.annualPremium} /> },
    { header: 'Paid', align: 'right', render: (p) => <CurrencyDisplay value={p.paidAmount} /> },
    { header: 'Balance', align: 'right', render: (p) => <CurrencyDisplay value={p.outstandingBalance} fontWeight={600} /> },
    {
      header: 'Actions', align: 'right', width: 70,
      render: (p) => (
        <RowActions actions={[{ title: 'View', icon: <VisibilityOutlined />, onClick: () => navigate(`/commercial-auto/policies/${p.id}`) }]} />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Policies" description="Policies are created by binding an approved quote." />
      <ListToolbar>
        <SearchField value={search} onChange={setSearch} placeholder="Search by policy #, quote # or customer" />
        <FilterSelect
          label="Status" value={status} onChange={(v) => setStatus(v as PolicyStatus | '')}
          options={STATUSES.map((s) => ({ value: s, label: prettify(s) }))}
        />
      </ListToolbar>
      <DataTable
        columns={columns} rows={data} rowKey={(p) => p.id} loading={loading} error={error} onRetry={reload}
        onRowClick={(p) => navigate(`/commercial-auto/policies/${p.id}`)}
        emptyTitle="No policies found" emptyMessage={debouncedSearch || status ? 'Try changing the search or filter.' : 'Approve a quote and bind it to create the first policy.'}
      />
    </>
  );
}
