import type { ReactNode } from 'react';
import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { Coverage, Driver, PremiumBreakdown, Vehicle } from '../types';
import { coverageValueText, formatCurrency, formatDate, prettify } from '../utils/format';

/** Tables shared by the quote review step, the quote page and the policy page. */

export function VehiclesTable({ vehicles, actions }: { vehicles: Vehicle[]; actions?: (vehicle: Vehicle, index: number) => ReactNode }) {
  return (
    <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: 1.5 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Vehicle</TableCell><TableCell>VIN</TableCell><TableCell>Type</TableCell><TableCell>Use</TableCell>
            <TableCell align="right">Annual Miles</TableCell><TableCell align="right">Value</TableCell>
            {actions && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((v, index) => (
            <TableRow key={v.id ?? v.vin}>
              <TableCell>{v.year} {v.make} {v.model}</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>{v.vin}</TableCell>
              <TableCell>{prettify(v.vehicleType)}</TableCell>
              <TableCell>{prettify(v.vehicleUse)}</TableCell>
              <TableCell align="right">{v.annualMileage.toLocaleString('en-US')}</TableCell>
              <TableCell align="right">{formatCurrency(v.vehicleValue)}</TableCell>
              {actions && <TableCell align="right">{actions(v, index)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function DriversTable({ drivers, actions }: { drivers: Driver[]; actions?: (driver: Driver, index: number) => ReactNode }) {
  return (
    <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: 1.5 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Driver</TableCell><TableCell>Date of Birth</TableCell><TableCell>License</TableCell>
            <TableCell align="right">Years Driving</TableCell><TableCell align="right">Accidents (3 yrs)</TableCell>
            <TableCell align="right">Violations (3 yrs)</TableCell>
            {actions && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.map((d, index) => (
            <TableRow key={d.id ?? d.licenseNumber}>
              <TableCell>{d.firstName} {d.lastName}</TableCell>
              <TableCell>{formatDate(d.dateOfBirth)}</TableCell>
              <TableCell>{d.licenseNumber} ({d.licenseState})</TableCell>
              <TableCell align="right">{d.yearsDriving}</TableCell>
              <TableCell align="right">{d.accidentsLast3Years}</TableCell>
              <TableCell align="right">{d.violationsLast3Years}</TableCell>
              {actions && <TableCell align="right">{actions(d, index)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** Liability $1,000,000 / Collision $1,000 Deductible ... */
export function CoveragesList({ coverages }: { coverages: Coverage[] }) {
  return (
    <Box>
      {coverages.map((c, index) => (
        <Box key={c.coverageType}>
          {index > 0 && <Divider />}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25 }}>
            <Typography variant="body2" fontWeight={600}>{prettify(c.coverageType)}</Typography>
            <Typography variant="body2">{coverageValueText(c)}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export const PREMIUM_DISCLAIMER =
  'This premium uses a simplified demonstration rating formula and is not an actual insurance carrier rate.';

export function PremiumPanel({ premium }: { premium: PremiumBreakdown }) {
  const rows: [string, number][] = [
    ['Base Premium', premium.basePremium],
    ['Vehicle Premium', premium.vehiclePremium],
    ['Vehicle Type Adjustment', premium.vehicleTypeAdjustment],
    ['Vehicle Value Adjustment', premium.vehicleValueAdjustment],
    ['Driver Premium', premium.driverPremium],
    ['Accident Adjustment', premium.accidentAdjustment],
    ['Violation Adjustment', premium.violationAdjustment],
    ['Coverage Premium', premium.coveragePremium],
  ];
  return (
    <Box>
      {rows.map(([label, amount]) => (
        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="body2">{formatCurrency(amount)}</Typography>
        </Box>
      ))}
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1.5, py: 1, bgcolor: '#EEF4FD', borderRadius: 1.5 }}>
        <Typography variant="subtitle1">Total Annual Premium</Typography>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(premium.totalAnnualPremium)}</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>{PREMIUM_DISCLAIMER}</Typography>
    </Box>
  );
}

/** A small "Label / value" pair used on detail pages. */
export function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7C95', mb: 0.25 }}>{label}</Typography>
      <Typography variant="body2" component="div" sx={{ fontWeight: 600, color: '#0B2545' }}>{children || '—'}</Typography>
    </Box>
  );
}
