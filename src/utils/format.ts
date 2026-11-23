import type { Coverage } from '../types';

const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** $1,000.00 everywhere. */
export function formatCurrency(value?: number | null): string {
  return value === null || value === undefined ? '—' : currencyFormat.format(value);
}

/** LocalDate "2027-01-01" -> "Jan 01, 2027" (parsed by hand so the time zone cannot shift the day). */
export function formatDate(value?: string | null): string {
  if (!value) return '—';
  const [year, month, day] = value.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

const SPECIAL_LABELS: Record<string, string> = { ACH: 'ACH', UM_UIM: 'UM/UIM' };

/** PICKUP_TRUCK -> Pickup Truck */
export function prettify(value?: string | null): string {
  if (!value) return '—';
  if (SPECIAL_LABELS[value]) return SPECIAL_LABELS[value];
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function addYears(isoDate: string, years: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year + years, month - 1, day);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** "Liability  $1,000,000"  or  "Collision  $1,000 Deductible" */
export function coverageValueText(coverage: Coverage): string {
  if (coverage.coverageType === 'LIABILITY' || coverage.coverageType === 'UM_UIM') {
    return formatCurrency(coverage.limitAmount);
  }
  return `${formatCurrency(coverage.deductibleAmount)} Deductible`;
}

export function vehicleName(v: { year: number; make: string; model: string }): string {
  return `${v.year} ${v.make} ${v.model}`;
}
