import { api } from './client';
import type {
  Claim, ClaimRequest, ClaimStatus, ClaimStatusUpdate, CoverageOption, Customer, CustomerRequest,
  DashboardSummary, Option, Payment, PaymentRequest, Policy, PolicyStatus, PolicySummary,
  Quote, QuoteRequest, QuoteStatus, QuoteSummary,
} from '../types';

// Every path below matches a Spring Boot controller method exactly.

const clean = (value?: string) => (value && value.trim() !== '' ? value.trim() : undefined);

export const customerApi = {
  list: (search?: string) => api.get<Customer[]>('/api/customers', { params: { search: clean(search) } }).then((r) => r.data),
  get: (id: number) => api.get<Customer>(`/api/customers/${id}`).then((r) => r.data),
  create: (body: CustomerRequest) => api.post<Customer>('/api/customers', body).then((r) => r.data),
  update: (id: number, body: CustomerRequest) => api.put<Customer>(`/api/customers/${id}`, body).then((r) => r.data),
  remove: (id: number) => api.delete(`/api/customers/${id}`).then(() => undefined),
};

export const quoteApi = {
  list: (status?: QuoteStatus | '', search?: string) =>
    api.get<QuoteSummary[]>('/api/quotes', { params: { status: status || undefined, search: clean(search) } }).then((r) => r.data),
  get: (id: number) => api.get<Quote>(`/api/quotes/${id}`).then((r) => r.data),
  create: (body: QuoteRequest) => api.post<Quote>('/api/quotes', body).then((r) => r.data),
  update: (id: number, body: QuoteRequest) => api.put<Quote>(`/api/quotes/${id}`, body).then((r) => r.data),
  remove: (id: number) => api.delete(`/api/quotes/${id}`).then(() => undefined),
  calculatePremium: (id: number) => api.post<Quote>(`/api/quotes/${id}/calculate-premium`).then((r) => r.data),
  submit: (id: number) => api.post<Quote>(`/api/quotes/${id}/submit`).then((r) => r.data),
  approve: (id: number, note?: string) => api.post<Quote>(`/api/quotes/${id}/approve`, { note: clean(note) ?? null }).then((r) => r.data),
  reject: (id: number, note?: string) => api.post<Quote>(`/api/quotes/${id}/reject`, { note: clean(note) ?? null }).then((r) => r.data),
  bind: (id: number) => api.post<Policy>(`/api/quotes/${id}/bind`).then((r) => r.data),
};

export const policyApi = {
  list: (status?: PolicyStatus | '', search?: string) =>
    api.get<PolicySummary[]>('/api/policies', { params: { status: status || undefined, search: clean(search) } }).then((r) => r.data),
  get: (id: number) => api.get<Policy>(`/api/policies/${id}`).then((r) => r.data),
  cancel: (id: number, reason: string) => api.post<Policy>(`/api/policies/${id}/cancel`, { reason }).then((r) => r.data),
};

export const paymentApi = {
  list: (policyId?: number) => api.get<Payment[]>('/api/payments', { params: { policyId } }).then((r) => r.data),
  get: (id: number) => api.get<Payment>(`/api/payments/${id}`).then((r) => r.data),
  create: (body: PaymentRequest) => api.post<Payment>('/api/payments', body).then((r) => r.data),
  reverse: (id: number) => api.post<Payment>(`/api/payments/${id}/reverse`).then((r) => r.data),
};

export const claimApi = {
  list: (status?: ClaimStatus | '', policyId?: number, search?: string) =>
    api.get<Claim[]>('/api/claims', { params: { status: status || undefined, policyId, search: clean(search) } }).then((r) => r.data),
  get: (id: number) => api.get<Claim>(`/api/claims/${id}`).then((r) => r.data),
  create: (body: ClaimRequest) => api.post<Claim>('/api/claims', body).then((r) => r.data),
  updateStatus: (id: number, body: ClaimStatusUpdate) => api.put<Claim>(`/api/claims/${id}/status`, body).then((r) => r.data),
};

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>('/api/dashboard/summary').then((r) => r.data),
  recentQuotes: () => api.get<QuoteSummary[]>('/api/dashboard/recent-quotes').then((r) => r.data),
  recentPolicies: () => api.get<PolicySummary[]>('/api/dashboard/recent-policies').then((r) => r.data),
};

export const referenceApi = {
  states: () => api.get<Option[]>('/api/reference-data/states').then((r) => r.data),
  businessTypes: () => api.get<Option[]>('/api/reference-data/business-types').then((r) => r.data),
  vehicleTypes: () => api.get<Option[]>('/api/reference-data/vehicle-types').then((r) => r.data),
  vehicleUses: () => api.get<Option[]>('/api/reference-data/vehicle-uses').then((r) => r.data),
  paymentMethods: () => api.get<Option[]>('/api/reference-data/payment-methods').then((r) => r.data),
  coverageOptions: () => api.get<CoverageOption[]>('/api/reference-data/coverage-options').then((r) => r.data),
};
