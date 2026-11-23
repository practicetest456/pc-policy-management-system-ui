import { useEffect, useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { claimApi, policyApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ErrorAlert from '../../../components/ErrorAlert';
import FormField from '../../../components/FormField';
import FormGrid from '../../../components/FormGrid';
import FormSection from '../../../components/FormSection';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageHeader from '../../../components/PageHeader';
import { useNotify } from '../../../components/SuccessSnackbar';
import { useFetch } from '../../../hooks/useFetch';
import { claimSchema } from '../../../schemas';
import type { ClaimFormValues } from '../../../schemas';
import { todayIso, vehicleName } from '../../../utils/format';

export default function ClaimForm() {
  const [params] = useSearchParams();
  const presetPolicy = params.get('policyId') ?? '';
  const navigate = useNavigate();
  const notify = useNotify();
  const policies = useFetch(() => policyApi.list('ACTIVE'), []);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; fieldErrors?: Record<string, string> } | null>(null);

  const { control, handleSubmit, watch, setValue } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      policyId: presetPolicy, accidentDate: '', accidentLocation: '', vehicleId: '', driverId: '', description: '',
      estimatedDamage: NaN, policeReportNumber: '', notes: '',
    },
  });

  // The vehicles and drivers on the chosen policy fill the two dropdowns.
  const policyId = watch('policyId');
  const policyDetail = useFetch(() => (policyId ? policyApi.get(Number(policyId)) : Promise.resolve(null)), [policyId]);

  useEffect(() => {
    setValue('vehicleId', '');
    setValue('driverId', '');
  }, [policyId, setValue]);

  const onSubmit = async (values: ClaimFormValues) => {
    setSaving(true);
    setApiError(null);
    try {
      const claim = await claimApi.create({
        policyId: Number(values.policyId),
        accidentDate: values.accidentDate,
        accidentLocation: values.accidentLocation,
        vehicleId: Number(values.vehicleId),
        driverId: Number(values.driverId),
        description: values.description,
        estimatedDamage: values.estimatedDamage,
        policeReportNumber: values.policeReportNumber || null,
        notes: values.notes || null,
      });
      notify(`Claim ${claim.claimNumber} filed`);
      navigate(`/commercial-auto/claims/${claim.id}`);
    } catch (err) {
      setApiError(parseApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (policies.loading) return <LoadingSpinner />;

  const detail = policyDetail.data;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title="File Claim" description="Record an accident on an active policy." />
      <ErrorAlert message={apiError?.message} fieldErrors={apiError?.fieldErrors} />
      {policies.error && <ErrorAlert message={policies.error} onRetry={policies.reload} />}
      {policies.data?.length === 0 && <Alert severity="info" sx={{ mb: 2 }}>There are no active policies to file a claim against.</Alert>}

      <FormSection title="Accident">
        <FormGrid>
          <FormField
            control={control} name="policyId" label="Policy" required fullRow
            options={(policies.data ?? []).map((p) => ({ value: String(p.id), label: `${p.policyNumber} — ${p.businessName}` }))}
          />
          <FormField control={control} name="accidentDate" label="Accident Date" type="date" max={todayIso()} required />
          <FormField control={control} name="accidentLocation" label="Accident Location" required />
          <FormField
            control={control} name="vehicleId" label="Vehicle" required disabled={!detail}
            options={(detail?.vehicles ?? []).map((v) => ({ value: String(v.id), label: vehicleName(v) }))}
            helperText={!detail ? 'Select a policy first' : undefined}
          />
          <FormField
            control={control} name="driverId" label="Driver" required disabled={!detail}
            options={(detail?.drivers ?? []).map((d) => ({ value: String(d.id), label: `${d.firstName} ${d.lastName}` }))}
            helperText={!detail ? 'Select a policy first' : undefined}
          />
          <FormField control={control} name="description" label="Accident Description" required multiline rows={3} fullRow />
        </FormGrid>
      </FormSection>

      <FormSection title="Damage and Report">
        <FormGrid>
          <FormField control={control} name="estimatedDamage" label="Estimated Damage ($)" type="number" step="0.01" min={0} required />
          <FormField control={control} name="policeReportNumber" label="Police Report Number" />
          <FormField control={control} name="notes" label="Notes" multiline rows={3} fullRow />
        </FormGrid>
      </FormSection>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Filing…' : 'File Claim'}</Button>
      </Box>
    </form>
  );
}
