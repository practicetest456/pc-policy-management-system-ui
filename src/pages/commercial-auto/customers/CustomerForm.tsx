import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { customerApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ErrorAlert from '../../../components/ErrorAlert';
import FormField from '../../../components/FormField';
import FormGrid from '../../../components/FormGrid';
import FormSection from '../../../components/FormSection';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageHeader from '../../../components/PageHeader';
import { useNotify } from '../../../components/SuccessSnackbar';
import { useReferenceData } from '../../../hooks/useReferenceData';
import { customerSchema } from '../../../schemas';
import type { CustomerFormValues } from '../../../schemas';
import type { BusinessType, CustomerRequest } from '../../../types';

const EMPTY: CustomerFormValues = {
  businessName: '', businessType: '', contactFirstName: '', contactLastName: '', email: '', phone: '',
  addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', yearsInBusiness: NaN, numberOfEmployees: NaN,
};

export default function CustomerForm() {
  const { id } = useParams();
  const editing = !!id;
  const navigate = useNavigate();
  const notify = useNotify();
  const { data: reference } = useReferenceData();
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; fieldErrors?: Record<string, string> } | null>(null);

  const { control, handleSubmit, reset, setError } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!id) return;
    customerApi.get(Number(id))
      .then((c) => reset({ ...c, addressLine2: c.addressLine2 ?? '' }))
      .catch((err) => setApiError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (values: CustomerFormValues) => {
    setSaving(true);
    setApiError(null);
    const body: CustomerRequest = {
      ...values,
      businessType: values.businessType as BusinessType,
      addressLine2: values.addressLine2 ? values.addressLine2 : null,
    };
    try {
      const saved = editing ? await customerApi.update(Number(id), body) : await customerApi.create(body);
      notify(editing ? 'Customer updated' : `Customer ${saved.customerNumber} created`);
      navigate(`/commercial-auto/customers/${saved.id}`);
    } catch (err) {
      const parsed = parseApiError(err);
      setApiError(parsed);
      // show server-side field errors under the matching inputs
      Object.entries(parsed.fieldErrors ?? {}).forEach(([field, message]) => {
        if (field in EMPTY) setError(field as keyof CustomerFormValues, { message });
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !reference) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader
        title={editing ? 'Edit Customer' : 'New Customer'}
        description="Customer is the business buying Commercial Auto insurance."
      />
      <ErrorAlert message={apiError?.message} fieldErrors={apiError?.fieldErrors} />

      <FormSection title="Business">
        <FormGrid columns={4}>
          <FormField control={control} name="businessName" label="Business Name" required />
          <FormField control={control} name="businessType" label="Business Type" required options={reference.businessTypes} />
          <FormField control={control} name="yearsInBusiness" label="Years in Business" type="number" min={0} required />
          <FormField control={control} name="numberOfEmployees" label="Number of Employees" type="number" min={1} required />
        </FormGrid>
      </FormSection>

      <FormSection title="Contact">
        <FormGrid columns={4}>
          <FormField control={control} name="contactFirstName" label="Contact First Name" required />
          <FormField control={control} name="contactLastName" label="Contact Last Name" required />
          <FormField control={control} name="email" label="Email" type="email" required />
          <FormField control={control} name="phone" label="Phone" required helperText="Format: 214-555-0148" />
        </FormGrid>
      </FormSection>

      <FormSection title="Address">
        <FormGrid columns={3}>
          <FormField control={control} name="addressLine1" label="Address Line 1" required />
          <FormField control={control} name="addressLine2" label="Address Line 2" />
          <FormField control={control} name="city" label="City" required />
          <FormField control={control} name="state" label="State" required options={reference.states} />
          <FormField control={control} name="zipCode" label="ZIP Code" required />
        </FormGrid>
      </FormSection>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Customer'}</Button>
      </Box>
    </form>
  );
}
