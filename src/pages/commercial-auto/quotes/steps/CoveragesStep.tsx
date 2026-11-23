import type { ReactNode } from 'react';
import { Box, Button, Card, Chip, MenuItem, Switch, TextField, Typography } from '@mui/material';
import DirectionsCarOutlined from '@mui/icons-material/DirectionsCarOutlined';
import GavelOutlined from '@mui/icons-material/GavelOutlined';
import type { CoverageOption } from '../../../../types';
import { formatCurrency } from '../../../../utils/format';
import type { CoverageSelection } from '../wizardTypes';

interface Props {
  options: CoverageOption[];
  selection: CoverageSelection;
  onChange: (selection: CoverageSelection) => void;
  onBack: () => void;
  onNext: () => void;
}

const GROUPS: { key: CoverageOption['group']; title: string; subtitle: string; icon: ReactNode }[] = [
  { key: 'PROPERTY_PROTECTION', title: 'Property Protection', subtitle: 'Protects the insured vehicles', icon: <DirectionsCarOutlined /> },
  { key: 'LIABILITY_CASUALTY_PROTECTION', title: 'Liability / Casualty Protection', subtitle: 'Responds to injury or damage to other people', icon: <GavelOutlined /> },
];

/** Step 4 - four simple coverages, grouped as Property and Liability/Casualty. */
export default function CoveragesStep({ options, selection, onChange, onBack, onNext }: Props) {
  const update = (option: CoverageOption, patch: Partial<{ enabled: boolean; amount: number }>) =>
    onChange({ ...selection, [option.coverageType]: { ...selection[option.coverageType], ...patch } });

  return (
    <>
      {GROUPS.map((group) => (
        <Box key={group.key} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ color: 'primary.main', display: 'flex' }}>{group.icon}</Box>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.2 }}>{group.title}</Typography>
              <Typography variant="body2" color="text.secondary">{group.subtitle}</Typography>
            </Box>
          </Box>
          {options.filter((o) => o.group === group.key).map((option) => {
            const item = selection[option.coverageType];
            return (
              <Card key={option.coverageType} variant="outlined" sx={{ p: 2, mb: 1.5, display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Switch
                  checked={item.enabled} disabled={option.required}
                  onChange={(e) => update(option, { enabled: e.target.checked })}
                  slotProps={{ input: { 'aria-label': `Include ${option.label}` } }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="subtitle1">{option.label}</Typography>
                    {option.required && <Chip size="small" label="Required" color="primary" variant="outlined" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">{option.description}</Typography>
                </Box>
                <TextField
                  select size="small" sx={{ minWidth: 220 }} disabled={!item.enabled}
                  label={option.optionType === 'LIMIT' ? 'Limit' : 'Deductible'}
                  value={item.amount} onChange={(e) => update(option, { amount: Number(e.target.value) })}
                >
                  {option.options.map((amount) => <MenuItem key={amount} value={amount}>{formatCurrency(amount)}</MenuItem>)}
                </TextField>
              </Card>
            );
          })}
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext}>Next</Button>
      </Box>
    </>
  );
}
