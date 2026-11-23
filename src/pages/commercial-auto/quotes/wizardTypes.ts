import type { BusinessFormValues } from '../../../schemas';
import type { Coverage, CoverageOption, CoverageType, Driver, PremiumBreakdown, Vehicle } from '../../../types';

/** For each coverage: is it selected, and which limit / deductible was chosen. */
export type CoverageSelection = Record<CoverageType, { enabled: boolean; amount: number }>;

/** Everything the wizard collects. It lives in the parent so Back/Next never loses data. */
export interface WizardState {
  quoteId: number | null;
  business: BusinessFormValues;
  vehicles: Vehicle[];
  drivers: Driver[];
  selection: CoverageSelection;
  premium: PremiumBreakdown | null;
}

/** Starts from the middle option of each coverage; Liability is always selected. */
export function buildSelection(options: CoverageOption[], existing: Coverage[] = []): CoverageSelection {
  const selection = {} as CoverageSelection;
  options.forEach((option) => {
    const chosen = existing.find((c) => c.coverageType === option.coverageType);
    const chosenAmount = option.optionType === 'LIMIT' ? chosen?.limitAmount : chosen?.deductibleAmount;
    selection[option.coverageType] = {
      enabled: option.required || !!chosen,
      amount: chosenAmount ?? option.options[Math.floor(option.options.length / 2)],
    };
  });
  return selection;
}

/** Liability and UM/UIM send a limit; Collision and Comprehensive send a deductible. */
export function selectionToCoverages(selection: CoverageSelection): Coverage[] {
  const coverages: Coverage[] = [];
  (Object.keys(selection) as CoverageType[]).forEach((type) => {
    const item = selection[type];
    if (!item.enabled) return;
    if (type === 'LIABILITY' || type === 'UM_UIM') {
      coverages.push({ coverageType: type, limitAmount: item.amount });
    } else {
      coverages.push({ coverageType: type, deductibleAmount: item.amount });
    }
  });
  return coverages;
}
