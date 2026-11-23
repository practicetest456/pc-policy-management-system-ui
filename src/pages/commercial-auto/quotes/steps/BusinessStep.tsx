import { useEffect } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import FormField from '../../../../components/FormField';
import FormGrid from '../../../../components/FormGrid';
import FormSection from '../../../../components/FormSection';
import { businessSchema } from '../../../../schemas';
import type { BusinessFormValues } from '../../../../schemas';
import type { Customer, Option } from '../../../../types';
import { addYears } from '../../../../utils/format';

interface Props {
  value: BusinessFormValues;
  customers: Customer[];
  states: Option[];
  onNext: (values: BusinessFormValues) => void;
  onCancel: () => void;
}

/** Step 1 - which customer, policy dates and what the business does. */
export default function BusinessStep({ value, customers, states, onNext, onCancel }: Props) {
  const { control, handleSubmit, watch, setValue, formState: { dirtyFields } } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: value,
  });

  // Expiration defaults to one year after the effective date (still editable).
  const effective = watch('effectiveDate');
  useEffect(() => {
    if (dirtyFields.effectiveDate && effective) {
      setValue('expirationDate', addYears(effective, 1), { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effective]);

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <FormSection title="Business" subtitle="Select the customer and describe how the vehicles are used.">
        {customers.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }} action={<Button color="inherit" size="small" component={RouterLink} to="/commercial-auto/customers/new">Add Customer</Button>}>
            There are no customers yet. Add a customer first.
          </Alert>
        )}
        <FormGrid>
          <FormField
            control={control} name="customerId" label="Customer" required fullRow
            options={customers.map((c) => ({ value: String(c.id), label: `${c.businessName} (${c.customerNumber})` }))}
          />
          <FormField control={control} name="effectiveDate" label="Requested Effective Date" type="date" required />
          <FormField control={control} name="expirationDate" label="Requested Expiration Date" type="date" required />
          <FormField control={control} name="businessDescription" label="Business Description" required multiline rows={3} fullRow />
          <FormField control={control} name="businessUse" label="Business Use" required helperText="Example: Service calls to customer locations" />
          <FormField control={control} name="primaryState" label="Primary Operating State" required options={states} />
        </FormGrid>
      </FormSection>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">Next</Button>
      </Box>
    </form>
  );
}
