import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { customerApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ConfirmDialog from '../../../components/ConfirmDialog';
import DataTable from '../../../components/DataTable';
import type { Column } from '../../../components/DataTable';
import ErrorAlert from '../../../components/ErrorAlert';
import ListToolbar from '../../../components/ListToolbar';
import PageHeader from '../../../components/PageHeader';
import RowActions from '../../../components/RowActions';
import SearchField from '../../../components/SearchField';
import { useNotify } from '../../../components/SuccessSnackbar';
import { useDebounced, useFetch } from '../../../hooks/useFetch';
import type { Customer } from '../../../types';
import { prettify } from '../../../utils/format';

export default function CustomerList() {
  const navigate = useNavigate();
  const notify = useNotify();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search);
  const [toDelete, setToDelete] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error, reload } = useFetch(() => customerApi.list(debouncedSearch), [debouncedSearch]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setActionError(null);
    try {
      await customerApi.remove(toDelete.id);
      notify(`${toDelete.businessName} was deleted`);
      setToDelete(null);
      reload();
    } catch (err) {
      setActionError(parseApiError(err).message);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Customer>[] = [
    { header: 'Customer #', render: (c) => c.customerNumber, width: 110 },
    { header: 'Business', render: (c) => <strong>{c.businessName}</strong>, minWidth: 170, wrap: true },
    { header: 'Type', render: (c) => prettify(c.businessType) },
    { header: 'Contact', render: (c) => `${c.contactFirstName} ${c.contactLastName}` },
    { header: 'Email', render: (c) => c.email },
    { header: 'Phone', render: (c) => c.phone, minWidth: 120 },
    { header: 'Location', render: (c) => `${c.city}, ${c.state}` },
    {
      header: 'Actions', align: 'right', width: 110,
      render: (c) => (
        <RowActions
          actions={[
            { title: 'View', icon: <VisibilityOutlined />, onClick: () => navigate(`/commercial-auto/customers/${c.id}`) },
            { title: 'Edit', icon: <EditOutlined />, onClick: () => navigate(`/commercial-auto/customers/${c.id}/edit`) },
            { title: 'Delete', icon: <DeleteOutline />, danger: true, onClick: () => setToDelete(c) },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        description="Businesses that buy Commercial Auto insurance."
        actions={<Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/commercial-auto/customers/new">Add Customer</Button>}
      />
      <ListToolbar>
        <SearchField value={search} onChange={setSearch} placeholder="Search by name, contact, email, city or customer #" width={420} />
      </ListToolbar>
      <ErrorAlert message={actionError} />
      <DataTable
        columns={columns} rows={data} rowKey={(c) => c.id} loading={loading} error={error} onRetry={reload}
        onRowClick={(c) => navigate(`/commercial-auto/customers/${c.id}`)}
        emptyTitle={debouncedSearch ? 'No customers match your search' : 'No customers yet'}
        emptyMessage={debouncedSearch ? 'Try a different search.' : 'Add your first customer to start a quote.'}
        emptyAction={!debouncedSearch && <Button variant="contained" component={RouterLink} to="/commercial-auto/customers/new">Add Customer</Button>}
      />
      <ConfirmDialog
        open={!!toDelete} danger loading={deleting} confirmLabel="Delete" title="Delete customer?"
        message={`This will permanently delete ${toDelete?.businessName ?? 'this customer'}. A customer that already has quotes cannot be deleted.`}
        onConfirm={confirmDelete} onCancel={() => setToDelete(null)}
      />
    </>
  );
}
