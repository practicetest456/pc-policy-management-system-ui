// These types mirror the Spring Boot DTOs field for field.

export type BusinessType = 'PLUMBING' | 'ELECTRICAL' | 'CLEANING' | 'DELIVERY' | 'LANDSCAPING' | 'GENERAL_SERVICE' | 'OTHER';
export type VehicleType = 'CAR' | 'VAN' | 'PICKUP_TRUCK' | 'BOX_TRUCK' | 'OTHER';
export type VehicleUse = 'SERVICE' | 'DELIVERY' | 'SALES' | 'GENERAL_BUSINESS';
export type CoverageType = 'LIABILITY' | 'COLLISION' | 'COMPREHENSIVE' | 'UM_UIM';
export type QuoteStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'BOUND';
export type PolicyStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'ACH' | 'CHECK';
export type PaymentStatus = 'COMPLETED' | 'REVERSED';
export type ClaimStatus = 'OPEN' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CLOSED';

// ---------- customers
export interface CustomerRequest {
  businessName: string;
  businessType: BusinessType;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  yearsInBusiness: number;
  numberOfEmployees: number;
}

export interface Customer extends CustomerRequest {
  id: number;
  customerNumber: string;
  createdAt: string;
}

// ---------- quote parts (also used by policies)
export interface Vehicle {
  id?: number | null;
  vin: string;
  year: number;
  make: string;
  model: string;
  vehicleType: VehicleType;
  vehicleUse: VehicleUse;
  annualMileage: number;
  vehicleValue: number;
}

export interface Driver {
  id?: number | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseState: string;
  yearsDriving: number;
  accidentsLast3Years: number;
  violationsLast3Years: number;
}

export interface Coverage {
  coverageType: CoverageType;
  limitAmount?: number | null;
  deductibleAmount?: number | null;
}

export interface PremiumBreakdown {
  basePremium: number;
  vehiclePremium: number;
  vehicleTypeAdjustment: number;
  vehicleValueAdjustment: number;
  driverPremium: number;
  accidentAdjustment: number;
  violationAdjustment: number;
  coveragePremium: number;
  totalAnnualPremium: number;
  calculatedAt: string;
}

export interface QuoteActivity {
  action: string;
  note?: string | null;
  createdAt: string;
}

// ---------- quotes
export interface QuoteRequest {
  customerId: number;
  effectiveDate: string;
  expirationDate: string;
  businessDescription: string;
  businessUse: string;
  primaryState: string;
  vehicles: Vehicle[];
  drivers: Driver[];
  coverages: Coverage[];
}

export interface Quote {
  id: number;
  quoteNumber: string;
  status: QuoteStatus;
  customer: Customer;
  effectiveDate: string;
  expirationDate: string;
  businessDescription: string;
  businessUse: string;
  primaryState: string;
  vehicles: Vehicle[];
  drivers: Driver[];
  coverages: Coverage[];
  premium: PremiumBreakdown | null;
  activities: QuoteActivity[];
  policyId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteSummary {
  id: number;
  quoteNumber: string;
  customerId: number;
  businessName: string;
  status: QuoteStatus;
  effectiveDate: string;
  expirationDate: string;
  totalAnnualPremium: number | null;
  createdAt: string;
}

// ---------- policies
export interface Policy {
  id: number;
  policyNumber: string;
  quoteId: number;
  quoteNumber: string;
  customer: Customer;
  effectiveDate: string;
  expirationDate: string;
  annualPremium: number;
  paidAmount: number;
  outstandingBalance: number;
  status: PolicyStatus;
  cancelledAt: string | null;
  cancellationReason: string | null;
  vehicles: Vehicle[];
  drivers: Driver[];
  coverages: Coverage[];
  createdAt: string;
}

export interface PolicySummary {
  id: number;
  policyNumber: string;
  quoteNumber: string;
  customerId: number;
  businessName: string;
  effectiveDate: string;
  expirationDate: string;
  annualPremium: number;
  paidAmount: number;
  outstandingBalance: number;
  status: PolicyStatus;
}

// ---------- payments
export interface PaymentRequest {
  policyId: number;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string | null;
  notes?: string | null;
}

export interface Payment {
  id: number;
  paymentNumber: string;
  policyId: number;
  policyNumber: string;
  businessName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string | null;
  notes: string | null;
  status: PaymentStatus;
  createdAt: string;
  reversedAt: string | null;
}

// ---------- claims
export interface ClaimRequest {
  policyId: number;
  accidentDate: string;
  accidentLocation: string;
  vehicleId: number;
  driverId: number;
  description: string;
  estimatedDamage: number;
  policeReportNumber?: string | null;
  notes?: string | null;
}

export interface ClaimHistory {
  fromStatus: ClaimStatus | null;
  toStatus: ClaimStatus;
  note: string | null;
  changedAt: string;
}

export interface Claim {
  id: number;
  claimNumber: string;
  policyId: number;
  policyNumber: string;
  businessName: string;
  accidentDate: string;
  accidentLocation: string;
  vehicleId: number;
  vehicleDescription: string;
  driverId: number;
  driverName: string;
  description: string;
  estimatedDamage: number;
  approvedAmount: number | null;
  policeReportNumber: string | null;
  notes: string | null;
  rejectionReason: string | null;
  status: ClaimStatus;
  createdAt: string;
  history: ClaimHistory[];
}

export interface ClaimStatusUpdate {
  newStatus: ClaimStatus;
  approvedAmount?: number | null;
  rejectionReason?: string | null;
  note?: string | null;
}

// ---------- dashboard
export interface StatusCount {
  status: string;
  count: number;
}

export interface DashboardSummary {
  totalCustomers: number;
  draftQuotes: number;
  submittedQuotes: number;
  activePolicies: number;
  openClaims: number;
  outstandingPayments: number;
  quotesByStatus: StatusCount[];
  claimsByStatus: StatusCount[];
}

// ---------- reference data and errors
export interface Option {
  value: string;
  label: string;
}

export interface CoverageOption {
  coverageType: CoverageType;
  label: string;
  group: 'PROPERTY_PROTECTION' | 'LIABILITY_CASUALTY_PROTECTION';
  required: boolean;
  description: string;
  optionType: 'LIMIT' | 'DEDUCTIBLE';
  options: number[];
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}
