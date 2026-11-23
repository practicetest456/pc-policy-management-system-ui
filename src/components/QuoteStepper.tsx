import { Card, Step, StepLabel, Stepper } from '@mui/material';

export const QUOTE_STEPS = ['Business', 'Vehicles', 'Drivers', 'Coverages', 'Review & Premium'];

export default function QuoteStepper({ activeStep }: { activeStep: number }) {
  return (
    <Card sx={{ px: 2, py: 1.75, mb: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {QUOTE_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Card>
  );
}
