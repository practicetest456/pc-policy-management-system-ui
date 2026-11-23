import { Alert, Box, Button, CircularProgress } from '@mui/material';
import CalculateOutlined from '@mui/icons-material/CalculateOutlined';
import ErrorAlert from '../../../../components/ErrorAlert';
import FormGrid from '../../../../components/FormGrid';
import FormSection from '../../../../components/FormSection';
import { CoveragesList, DriversTable, InfoItem, PremiumPanel, VehiclesTable } from '../../../../components/QuoteSections';
import type { ReferenceData } from '../../../../hooks/useReferenceData';
import type { Customer } from '../../../../types';
import { formatDate } from '../../../../utils/format';
import { selectionToCoverages } from '../wizardTypes';
import type { WizardState } from '../wizardTypes';

interface Props {
  state: WizardState;
  customer?: Customer;
  reference: ReferenceData;
  busy: 'calculate' | 'draft' | 'submit' | null;
  error: { message: string; fieldErrors?: Record<string, string> } | null;
  onBack: () => void;
  onCalculate: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

/** Step 5 - review everything and let Spring Boot calculate the premium. */
export default function ReviewStep({ state, customer, reference, busy, error, onBack, onCalculate, onSaveDraft, onSubmit }: Props) {
  const { business } = state;
  const working = busy !== null;

  return (
    <>
      <ErrorAlert message={error?.message} fieldErrors={error?.fieldErrors} />

      <FormSection title="Business">
        <FormGrid columns={3}>
          <InfoItem label="Customer">{customer?.businessName}</InfoItem>
          <InfoItem label="Location">{customer ? `${customer.city}, ${reference.stateName(customer.state)}` : ''}</InfoItem>
          <InfoItem label="Primary Operating State">{reference.stateName(business.primaryState)}</InfoItem>
          <InfoItem label="Policy Period">{formatDate(business.effectiveDate)} – {formatDate(business.expirationDate)}</InfoItem>
          <InfoItem label="Business Use">{business.businessUse}</InfoItem>
          <InfoItem label="Business Description">{business.businessDescription}</InfoItem>
        </FormGrid>
      </FormSection>

      <FormSection title={`Vehicles (${state.vehicles.length})`}><VehiclesTable vehicles={state.vehicles} /></FormSection>
      <FormSection title={`Drivers (${state.drivers.length})`}><DriversTable drivers={state.drivers} /></FormSection>
      <FormSection title="Coverages"><CoveragesList coverages={selectionToCoverages(state.selection)} /></FormSection>

      <FormSection
        title="Premium"
        subtitle="Calculated by the Spring Boot backend."
        action={
          <Button
            variant={state.premium ? 'outlined' : 'contained'} disabled={working}
            startIcon={busy === 'calculate' ? <CircularProgress size={16} /> : <CalculateOutlined />} onClick={onCalculate}
          >
            {state.premium ? 'Recalculate Premium' : 'Calculate Premium'}
          </Button>
        }
      >
        {state.premium ? (
          <PremiumPanel premium={state.premium} />
        ) : (
          <Alert severity="info">Click “Calculate Premium” to save this quote and see the premium. A quote cannot be submitted until its premium is calculated.</Alert>
        )}
      </FormSection>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
        <Button onClick={onBack} disabled={working}>Back</Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" onClick={onSaveDraft} disabled={working}>{busy === 'draft' ? 'Saving…' : 'Save as Draft'}</Button>
          <Button variant="contained" onClick={onSubmit} disabled={working || !state.premium}>{busy === 'submit' ? 'Submitting…' : 'Submit Quote'}</Button>
        </Box>
      </Box>
    </>
  );
}
