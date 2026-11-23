import { useEffect, useState } from 'react';
import { referenceApi } from '../api';
import type { CoverageOption, Option } from '../types';

export interface ReferenceData {
  states: Option[];
  businessTypes: Option[];
  vehicleTypes: Option[];
  vehicleUses: Option[];
  paymentMethods: Option[];
  coverageOptions: CoverageOption[];
  stateName: (code?: string | null) => string;
}

let cached: Promise<ReferenceData> | null = null;

function load(): Promise<ReferenceData> {
  return Promise.all([
    referenceApi.states(),
    referenceApi.businessTypes(),
    referenceApi.vehicleTypes(),
    referenceApi.vehicleUses(),
    referenceApi.paymentMethods(),
    referenceApi.coverageOptions(),
  ]).then(([states, businessTypes, vehicleTypes, vehicleUses, paymentMethods, coverageOptions]) => ({
    states, businessTypes, vehicleTypes, vehicleUses, paymentMethods, coverageOptions,
    stateName: (code) => states.find((s) => s.value === code)?.label ?? code ?? '—',
  }));
}

/** Dropdown values come from Spring Boot (loaded once, then cached). Returns null while loading. */
export function useReferenceData(): { data: ReferenceData | null; error: boolean } {
  const [data, setData] = useState<ReferenceData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!cached) cached = load();
    cached.then(setData).catch(() => {
      cached = null;
      setError(true);
    });
  }, []);

  return { data, error };
}
