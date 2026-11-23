import { useState } from 'react';
import { Alert, Box, Button, IconButton, Tooltip } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormField from '../../../../components/FormField';
import FormGrid from '../../../../components/FormGrid';
import FormSection from '../../../../components/FormSection';
import { VehiclesTable } from '../../../../components/QuoteSections';
import { vehicleSchema } from '../../../../schemas';
import type { VehicleFormValues } from '../../../../schemas';
import type { Option, Vehicle, VehicleType, VehicleUse } from '../../../../types';

const EMPTY: VehicleFormValues = {
  vin: '', year: NaN, make: '', model: '', vehicleType: '', vehicleUse: '', annualMileage: NaN, vehicleValue: NaN,
};

interface Props {
  vehicles: Vehicle[];
  types: Option[];
  uses: Option[];
  onChange: (vehicles: Vehicle[]) => void;
  onBack: () => void;
  onNext: () => void;
}

/** Step 2 - add, edit and remove vehicles (the PROPERTY being insured). */
export default function VehiclesStep({ vehicles, types, uses, onChange, onBack, onNext }: Props) {
  const { control, handleSubmit, reset } = useForm<VehicleFormValues>({ resolver: zodResolver(vehicleSchema), defaultValues: EMPTY });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const save = (values: VehicleFormValues) => {
    const vehicle: Vehicle = { ...values, vehicleType: values.vehicleType as VehicleType, vehicleUse: values.vehicleUse as VehicleUse };
    if (vehicles.some((v, i) => v.vin === vehicle.vin && i !== editIndex)) {
      setMessage('This VIN is already on the quote.');
      return;
    }
    onChange(editIndex === null ? [...vehicles, vehicle] : vehicles.map((v, i) => (i === editIndex ? { ...vehicle, id: v.id } : v)));
    reset(EMPTY);
    setEditIndex(null);
    setMessage(null);
  };

  const startEdit = (vehicle: Vehicle, index: number) => {
    reset({ ...vehicle, vehicleType: vehicle.vehicleType, vehicleUse: vehicle.vehicleUse });
    setEditIndex(index);
    setMessage(null);
  };

  const cancelEdit = () => {
    reset(EMPTY);
    setEditIndex(null);
  };

  return (
    <>
      <FormSection title={editIndex === null ? 'Add Vehicle' : 'Edit Vehicle'} subtitle="Each vehicle is a property exposure on the policy.">
        <form onSubmit={handleSubmit(save)} noValidate>
          <FormGrid columns={4}>
            <FormField control={control} name="vin" label="VIN" uppercase required helperText="17 characters" />
            <FormField control={control} name="year" label="Year" type="number" required />
            <FormField control={control} name="make" label="Make" required />
            <FormField control={control} name="model" label="Model" required />
            <FormField control={control} name="vehicleType" label="Vehicle Type" options={types} required />
            <FormField control={control} name="vehicleUse" label="Vehicle Use" options={uses} required />
            <FormField control={control} name="annualMileage" label="Annual Mileage" type="number" required />
            <FormField control={control} name="vehicleValue" label="Vehicle Value ($)" type="number" required />
          </FormGrid>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Button type="submit" variant="contained">{editIndex === null ? 'Add Vehicle' : 'Update Vehicle'}</Button>
            {editIndex !== null && <Button onClick={cancelEdit}>Cancel Edit</Button>}
          </Box>
          {message && <Alert severity="warning" sx={{ mt: 2 }}>{message}</Alert>}
        </form>
      </FormSection>

      <FormSection title={`Vehicles (${vehicles.length})`}>
        {vehicles.length === 0 ? (
          <Alert severity="info">Add at least one vehicle to continue.</Alert>
        ) : (
          <VehiclesTable
            vehicles={vehicles}
            actions={(vehicle, index) => (
              <>
                <Tooltip title="Edit"><IconButton size="small" onClick={() => startEdit(vehicle, index)}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Remove"><IconButton size="small" color="error" onClick={() => onChange(vehicles.filter((_, i) => i !== index))}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
              </>
            )}
          />
        )}
      </FormSection>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" disabled={vehicles.length === 0} onClick={onNext}>Next</Button>
      </Box>
    </>
  );
}
