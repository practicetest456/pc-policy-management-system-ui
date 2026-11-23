import { z } from 'zod';

// Zod rules mirror the Bean Validation rules in the Spring Boot DTOs.
// The backend validates again, so these only give faster feedback.

const required = (label: string) => z.string().trim().min(1, `${label} is required`);
const wholeNumber = (label: string) => z.number({ invalid_type_error: `${label} is required`, required_error: `${label} is required` });

export const customerSchema = z.object({
  businessName: required('Business name').max(100, 'Business name must be 100 characters or less'),
  businessType: required('Business type'),
  contactFirstName: required('Contact first name'),
  contactLastName: required('Contact last name'),
  email: z.string().trim().min(1, 'Valid email is required').email('Valid email is required'),
  phone: z.string().trim().regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone must look like 214-555-0148'),
  addressLine1: required('Address line 1'),
  addressLine2: z.string().optional(),
  city: required('City'),
  state: required('State'),
  zipCode: z.string().trim().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must look like 75226 or 75226-1234'),
  yearsInBusiness: wholeNumber('Years in business').int('Must be a whole number').min(0, 'Years in business cannot be negative'),
  numberOfEmployees: wholeNumber('Number of employees').int('Must be a whole number').min(1, 'Number of employees must be at least 1'),
});
export type CustomerFormValues = z.infer<typeof customerSchema>;

export const businessSchema = z
  .object({
    customerId: required('Customer'),
    effectiveDate: required('Effective date'),
    expirationDate: required('Expiration date'),
    businessDescription: required('Business description').max(500, 'Business description must be 500 characters or less'),
    businessUse: required('Business use'),
    primaryState: required('Primary operating state'),
  })
  .refine((v) => !v.effectiveDate || !v.expirationDate || v.expirationDate > v.effectiveDate, {
    path: ['expirationDate'],
    message: 'Expiration date must be after the effective date',
  });
export type BusinessFormValues = z.infer<typeof businessSchema>;

export const vehicleSchema = z.object({
  vin: z.string().trim().regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'VIN must be 17 characters (letters and digits, no I, O or Q)'),
  year: wholeNumber('Year').int('Must be a whole number').min(1980, 'Year must be 1980 or later').max(new Date().getFullYear() + 1, 'Year cannot be later than next year'),
  make: required('Make'),
  model: required('Model'),
  vehicleType: required('Vehicle type'),
  vehicleUse: required('Vehicle use'),
  annualMileage: wholeNumber('Annual mileage').int('Must be a whole number').positive('Annual mileage must be greater than zero'),
  vehicleValue: wholeNumber('Vehicle value').positive('Vehicle value must be greater than zero'),
});
export type VehicleFormValues = z.infer<typeof vehicleSchema>;

function ageOn(isoDate: string): number {
  const born = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const beforeBirthday = today.getMonth() < born.getMonth() || (today.getMonth() === born.getMonth() && today.getDate() < born.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export const driverSchema = z.object({
  firstName: required('First name'),
  lastName: required('Last name'),
  dateOfBirth: required('Date of birth').refine((v) => new Date(v) < new Date(), 'Date of birth must be in the past').refine((v) => ageOn(v) >= 16, 'Driver must be at least 16 years old'),
  licenseNumber: required('Driver license number'),
  licenseState: required('License state'),
  yearsDriving: wholeNumber('Years driving').int('Must be a whole number').min(0, 'Years driving cannot be negative'),
  accidentsLast3Years: wholeNumber('Accidents').int('Must be a whole number').min(0, 'Accidents cannot be negative'),
  violationsLast3Years: wholeNumber('Violations').int('Must be a whole number').min(0, 'Violations cannot be negative'),
});
export type DriverFormValues = z.infer<typeof driverSchema>;

export const paymentSchema = z.object({
  policyId: required('Policy'),
  paymentDate: required('Payment date'),
  amount: wholeNumber('Amount').positive('Payment amount must be greater than zero'),
  paymentMethod: required('Payment method'),
  referenceNumber: z.string().max(50, 'Reference number must be 50 characters or less').optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
});
export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const claimSchema = z.object({
  policyId: required('Policy'),
  accidentDate: required('Accident date'),
  accidentLocation: required('Accident location'),
  vehicleId: required('Vehicle'),
  driverId: required('Driver'),
  description: required('Accident description').max(1000, 'Description must be 1000 characters or less'),
  estimatedDamage: wholeNumber('Estimated damage').positive('Estimated damage must be greater than zero'),
  policeReportNumber: z.string().optional(),
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional(),
});
export type ClaimFormValues = z.infer<typeof claimSchema>;
