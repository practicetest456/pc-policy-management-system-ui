import { useEffect, useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi, policyApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ErrorAlert from '../../../components/ErrorAlert';
import FormField from '../../../components/FormField';
import FormGrid from '../../../components/FormGrid';
import FormSection from '../../../components/FormSection';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageHeader from '../../../components/PageHeader';
import { useNotify } from '../../../components/SuccessSnackbar';
import { useFetch } from '../../../hooks/useFetch';
import { useReferenceData } from '../../../hooks/useReferenceData';
import { paymentSchema } from '../../../schemas';
import type { PaymentFormValues } from '../../../schemas';
import type { PaymentMethod } from '../../../types';
import { formatCurrency, todayIso } from '../../../utils/format';

export default function PaymentForm() {
  const [params] = useSearchParams();
  const presetPolicy = params.get('policyId') ?? '';
  const navigate = useNavigate();
  const notify = useNotify();
  const { data: reference } = useReferenceData();
  const policies = useFetch(() => policyApi.list('ACTIVE'), []);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; fieldErrors?: Record<string, string> } | null>(null);

  const { control, handleSubmit, watch, setValue } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { policyId: presetPolicy, paymentDate: todayIso(), amount: NaN, paymentMethod: '', referenceNumber: '', notes: '' },
  });

  const selected = (policies.data ?? []).find((p) => String(p.id) === watch('policyId'));

  useEffect(() => {
    // keep the preset policy only if it is still active
    if (policies.data && presetPolicy && !policies.data.some((p) => String(p.id) === presetPolicy)) setValue('policyId', '');
  }, [policies.data, presetPolicy, setValue]);

  const onSubmit = async (values: PaymentFormValues) => {
    setSaving(true);
    setApiError(null);
    try {
      const payment = await paymentApi.create({
        policyId: Number(values.policyId),
        paymentDate: values.paymentDate,
        amount: values.amount,
        paymentMethod: values.paymentMethod as PaymentMethod,
        referenceNumber: values.referenceNumber || null,
        notes: values.notes || null,
      });
      notify(`Payment ${payment.paymentNumber} recorded`);
      navigate(presetPolicy ? `/commercial-auto/policies/${payment.policyId}` : '/commercial-auto/payments');
    } catch (err) {
      setApiError(parseApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (!reference || policies.loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title="Record Payment" description="Record a payment received for an active policy." />
      <ErrorAlert message={apiError?.message} fieldErrors={apiError?.fieldErrors} />
      {policies.error && <ErrorAlert message={policies.error} onRetry={policies.reload} />}
      {policies.data?.length === 0 && <Alert severity="info" sx={{ mb: 2 }}>There are no active policies to record a payment against.</Alert>}

      <FormSection title="Payment Details">
        <FormGrid>
          <FormField
            control={control} name="policyId" label="Policy" required fullRow
            options={(policies.data ?? []).map((p) => ({ value: String(p.id), label: `${p.policyNumber} — ${p.businessName} (balance ${formatCurrency(p.outstandingBalance)})` }))}
            helperText={selected ? `Outstanding balance: ${formatCurrency(selected.outstandingBalance)}` : undefined}
          />
          <FormField control={control} name="paymentDate" label="Payment Date" type="date" required />
          <FormField control={control} name="amount" label="Amount ($)" type="number" step="0.01" min={0} required />
          <FormField control={control} name="paymentMethod" label="Payment Method" options={reference.paymentMethods} required />
          <FormField control={control} name="referenceNumber" label="Reference Number" />
          <FormField control={control} name="notes" label="Notes" multiline rows={3} fullRow />
        </FormGrid>
      </FormSection>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving…' : 'Record Payment'}</Button>
      </Box>
    </form>
  );
}
