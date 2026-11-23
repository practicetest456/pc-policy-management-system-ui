import { MenuItem, TextField } from '@mui/material';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  allLabel?: string;
  width?: number;
}

/** Status filter dropdown used by the list pages. An empty value means "all". */
export default function FilterSelect({ label, value, onChange, options, allLabel = 'All statuses', width = 190 }: Props) {
  return (
    <TextField select label={label} value={value} onChange={(event) => onChange(event.target.value)} sx={{ width: { xs: '100%', sm: width } }}>
      <MenuItem value="">{allLabel}</MenuItem>
      {options.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
    </TextField>
  );
}
