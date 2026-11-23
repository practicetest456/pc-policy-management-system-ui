import { useState } from 'react';
import { Alert, Box, Button, IconButton, Tooltip } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormField from '../../../../components/FormField';
import FormGrid from '../../../../components/FormGrid';
import FormSection from '../../../../components/FormSection';
import { DriversTable } from '../../../../components/QuoteSections';
import { driverSchema } from '../../../../schemas';
import type { DriverFormValues } from '../../../../schemas';
import type { Driver, Option } from '../../../../types';

const EMPTY: DriverFormValues = {
  firstName: '', lastName: '', dateOfBirth: '', licenseNumber: '', licenseState: '',
  yearsDriving: NaN, accidentsLast3Years: NaN, violationsLast3Years: NaN,
};

interface Props {
  drivers: Driver[];
  states: Option[];
  onChange: (drivers: Driver[]) => void;
  onBack: () => void;
  onNext: () => void;
}

/** Step 3 - add, edit and remove drivers. Accidents and violations affect the premium. */
export default function DriversStep({ drivers, states, onChange, onBack, onNext }: Props) {
  const { control, handleSubmit, reset } = useForm<DriverFormValues>({ resolver: zodResolver(driverSchema), defaultValues: EMPTY });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const save = (values: DriverFormValues) => {
    const driver: Driver = { ...values };
    onChange(editIndex === null ? [...drivers, driver] : drivers.map((d, i) => (i === editIndex ? { ...driver, id: d.id } : d)));
    reset(EMPTY);
    setEditIndex(null);
  };

  const startEdit = (driver: Driver, index: number) => {
    reset({ ...driver });
    setEditIndex(index);
  };

  return (
    <>
      <FormSection title={editIndex === null ? 'Add Driver' : 'Edit Driver'} subtitle="Everyone who will drive the insured vehicles.">
        <form onSubmit={handleSubmit(save)} noValidate>
          <FormGrid columns={4}>
            <FormField control={control} name="firstName" label="First Name" required />
            <FormField control={control} name="lastName" label="Last Name" required />
            <FormField control={control} name="dateOfBirth" label="Date of Birth" type="date" required />
            <FormField control={control} name="licenseNumber" label="Driver License Number" required />
            <FormField control={control} name="licenseState" label="License State" options={states} required />
            <FormField control={control} name="yearsDriving" label="Years Driving" type="number" min={0} required />
            <FormField control={control} name="accidentsLast3Years" label="Accidents in Last 3 Years" type="number" min={0} required />
            <FormField control={control} name="violationsLast3Years" label="Violations in Last 3 Years" type="number" min={0} required />
          </FormGrid>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Button type="submit" variant="contained">{editIndex === null ? 'Add Driver' : 'Update Driver'}</Button>
            {editIndex !== null && <Button onClick={() => { reset(EMPTY); setEditIndex(null); }}>Cancel Edit</Button>}
          </Box>
        </form>
      </FormSection>

      <FormSection title={`Drivers (${drivers.length})`}>
        {drivers.length === 0 ? (
          <Alert severity="info">Add at least one driver to continue.</Alert>
        ) : (
          <DriversTable
            drivers={drivers}
            actions={(driver, index) => (
              <>
                <Tooltip title="Edit"><IconButton size="small" onClick={() => startEdit(driver, index)}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Remove"><IconButton size="small" color="error" onClick={() => onChange(drivers.filter((_, i) => i !== index))}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
              </>
            )}
          />
        )}
      </FormSection>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" disabled={drivers.length === 0} onClick={onNext}>Next</Button>
      </Box>
    </>
  );
}
