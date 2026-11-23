import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { claimApi } from '../../../api';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import DataTable from '../../../components/DataTable';
import type { Column } from '../../../components/DataTable';
import FilterSelect from '../../../components/FilterSelect';
import ListToolbar from '../../../components/ListToolbar';
import PageHeader from '../../../components/PageHeader';
import SearchField from '../../../components/SearchField';
import StatusChip from '../../../components/StatusChip';
import { useDebounced, useFetch } from '../../../hooks/useFetch';
import type { Claim, ClaimStatus } from '../../../types';
import { formatDate, prettify } from '../../../utils/format';

const STATUSES: ClaimStatus[] = ['OPEN', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID', 'CLOSED'];

export default function ClaimList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClaimStatus | ''>('');
  const debouncedSearch = useDebounced(search);
  const { data, loading, error, reload } = useFetch(() => claimApi.list(status, undefined, debouncedSearch), [status, debouncedSearch]);

  const columns: Column<Claim>[] = [
    { header: 'Claim #', render: (c) => <strong>{c.claimNumber}</strong>, width: 110 },
    { header: 'Policy', render: (c) => c.policyNumber, minWidth: 130 },
    { header: 'Customer', render: (c) => c.businessName, minWidth: 170, wrap: true },
    { header: 'Accident Date', render: (c) => formatDate(c.accidentDate) },
    { header: 'Vehicle', render: (c) => c.vehicleDescription },
    { header: 'Estimated', align: 'right', render: (c) => <CurrencyDisplay value={c.estimatedDamage} /> },
    { header: 'Approved', align: 'right', render: (c) => <CurrencyDisplay value={c.approvedAmount} /> },
    { header: 'Status', render: (c) => <StatusChip status={c.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Claims"
        description="Accident claims filed against active policies."
        actions={<Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/commercial-auto/claims/new">File Claim</Button>}
      />
      <ListToolbar>
        <SearchField value={search} onChange={setSearch} placeholder="Search by claim #, policy, customer or location" width={420} />
        <FilterSelect
          label="Status" value={status} onChange={(v) => setStatus(v as ClaimStatus | '')}
          options={STATUSES.map((s) => ({ value: s, label: prettify(s) }))}
        />
      </ListToolbar>
      <DataTable
        columns={columns} rows={data} rowKey={(c) => c.id} loading={loading} error={error} onRetry={reload}
        onRowClick={(c) => navigate(`/commercial-auto/claims/${c.id}`)}
        emptyTitle="No claims found" emptyMessage={debouncedSearch || status ? 'Try changing the search or filter.' : 'File a claim when an accident happens on an active policy.'}
      />
    </>
  );
}
