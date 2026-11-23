import { useEffect, useState } from 'react';
import { Alert, Button } from '@mui/material';
import { Link as RouterLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { customerApi, quoteApi } from '../../../api';
import { parseApiError } from '../../../api/client';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageHeader from '../../../components/PageHeader';
import QuoteStepper from '../../../components/QuoteStepper';
import { useNotify } from '../../../components/SuccessSnackbar';
import { useFetch } from '../../../hooks/useFetch';
import { useReferenceData } from '../../../hooks/useReferenceData';
import type { BusinessFormValues } from '../../../schemas';
import type { Quote, QuoteRequest } from '../../../types';
import { addYears, todayIso } from '../../../utils/format';
import BusinessStep from './steps/BusinessStep';
import CoveragesStep from './steps/CoveragesStep';
import DriversStep from './steps/DriversStep';
import ReviewStep from './steps/ReviewStep';
import VehiclesStep from './steps/VehiclesStep';
import { buildSelection, selectionToCoverages } from './wizardTypes';
import type { WizardState } from './wizardTypes';

type ApiErr = { message: string; fieldErrors?: Record<string, string> };

/** The five-step New Quote / Edit Draft wizard. All data is kept here, so Back and Next never lose anything. */
export default function QuoteWizard() {
  const { id } = useParams();
  const editing = !!id;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const { data: reference, error: referenceError } = useReferenceData();
  const customers = useFetch(() => customerApi.list(), []);

  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'calculate' | 'draft' | 'submit' | null>(null);
  const [apiError, setApiError] = useState<ApiErr | null>(null);

  // ---- load initial data (empty form, or the existing draft)
  useEffect(() => {
    if (!reference) return;
    if (!editing) {
      const today = todayIso();
      setState({
        quoteId: null,
        business: {
          customerId: searchParams.get('customerId') ?? '', effectiveDate: today, expirationDate: addYears(today, 1),
          businessDescription: '', businessUse: '', primaryState: '',
        },
        vehicles: [], drivers: [], selection: buildSelection(reference.coverageOptions), premium: null,
      });
      return;
    }
    quoteApi.get(Number(id))
      .then((q: Quote) => {
        if (q.status !== 'DRAFT') {
          setInitError('Only a draft quote can be edited.');
          return;
        }
        setState({
          quoteId: q.id,
          business: {
            customerId: String(q.customer.id), effectiveDate: q.effectiveDate, expirationDate: q.expirationDate,
            businessDescription: q.businessDescription, businessUse: q.businessUse, primaryState: q.primaryState,
          },
          vehicles: q.vehicles, drivers: q.drivers, selection: buildSelection(reference.coverageOptions, q.coverages), premium: q.premium,
        });
      })
      .catch((err) => setInitError(parseApiError(err).message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, id]);

  if (initError) {
    return (
      <>
        <ErrorAlert message={initError} />
        <Button component={RouterLink} to="/commercial-auto/quotes">Back to Quotes</Button>
      </>
    );
  }
  if (referenceError) return <ErrorAlert message="Could not load dropdown values from the backend. Is Spring Boot running?" />;
  if (!reference || !state || customers.loading) return <LoadingSpinner />;

  /** Any change to the quote makes an earlier premium out of date, so it is cleared. */
  const change = (patch: Partial<WizardState>) => {
    setApiError(null);
    setState((s) => (s ? { ...s, ...patch, premium: null } : s));
  };

  const saveBusiness = (values: BusinessFormValues) => {
    if (JSON.stringify(values) !== JSON.stringify(state.business)) change({ business: values });
    setStep(1);
  };

  const toRequest = (): QuoteRequest => ({
    customerId: Number(state.business.customerId),
    effectiveDate: state.business.effectiveDate,
    expirationDate: state.business.expirationDate,
    businessDescription: state.business.businessDescription,
    businessUse: state.business.businessUse,
    primaryState: state.business.primaryState,
    vehicles: state.vehicles,
    drivers: state.drivers,
    coverages: selectionToCoverages(state.selection),
  });

  /** Create the quote on first save, update it afterwards. */
  const persist = async (): Promise<Quote> => {
    const quote = state.quoteId ? await quoteApi.update(state.quoteId, toRequest()) : await quoteApi.create(toRequest());
    setState((s) => (s ? { ...s, quoteId: quote.id, premium: quote.premium } : s));
    return quote;
  };

  const run = async (kind: 'calculate' | 'draft' | 'submit', action: () => Promise<void>) => {
    setBusy(kind);
    setApiError(null);
    try {
      await action();
    } catch (err) {
      setApiError(parseApiError(err));
    } finally {
      setBusy(null);
    }
  };

  const calculate = () => run('calculate', async () => {
    const saved = await persist();
    const calculated = await quoteApi.calculatePremium(saved.id);
    setState((s) => (s ? { ...s, quoteId: calculated.id, premium: calculated.premium } : s));
    notify('Premium calculated');
  });

  const saveDraft = () => run('draft', async () => {
    const saved = await persist();
    notify(`Draft ${saved.quoteNumber} saved`);
    navigate(`/commercial-auto/quotes/${saved.id}`);
  });

  const submit = () => run('submit', async () => {
    if (!state.quoteId || !state.premium) return;
    const submitted = await quoteApi.submit(state.quoteId);
    notify(`Quote ${submitted.quoteNumber} submitted`);
    navigate(`/commercial-auto/quotes/${submitted.id}`);
  });

  return (
    <>
      <PageHeader
        title={editing ? 'Edit Draft Quote' : 'New Commercial Auto Quote'}
        description={`Step ${step + 1} of 5`}
        actions={<Button component={RouterLink} to="/commercial-auto/quotes">Exit</Button>}
      />
      <QuoteStepper activeStep={step} />

      {step === 0 && (
        <BusinessStep
          value={state.business} customers={customers.data ?? []} states={reference.states}
          onNext={saveBusiness} onCancel={() => navigate('/commercial-auto/quotes')}
        />
      )}
      {step === 1 && (
        <VehiclesStep
          vehicles={state.vehicles} types={reference.vehicleTypes} uses={reference.vehicleUses}
          onChange={(vehicles) => change({ vehicles })} onBack={() => setStep(0)} onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <DriversStep
          drivers={state.drivers} states={reference.states}
          onChange={(drivers) => change({ drivers })} onBack={() => setStep(1)} onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <CoveragesStep
          options={reference.coverageOptions} selection={state.selection}
          onChange={(selection) => change({ selection })} onBack={() => setStep(2)} onNext={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <ReviewStep
          state={state} reference={reference} busy={busy} error={apiError}
          customer={(customers.data ?? []).find((c) => String(c.id) === state.business.customerId)}
          onBack={() => setStep(3)} onCalculate={calculate} onSaveDraft={saveDraft} onSubmit={submit}
        />
      )}
      {customers.error && <Alert severity="error" sx={{ mt: 2 }}>{customers.error}</Alert>}
    </>
  );
}
