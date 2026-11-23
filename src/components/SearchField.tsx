import { IconButton, InputAdornment, TextField } from '@mui/material';
import Close from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  width?: number;
}

/** The search box used by every list page. */
export default function SearchField({ value, onChange, placeholder, width = 360 }: Props) {
  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      sx={{ width: { xs: '100%', sm: width } }}
      slotProps={{
        htmlInput: { 'aria-label': placeholder },
        input: {
          startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" aria-label="Clear search" onClick={() => onChange('')}><Close sx={{ fontSize: 16 }} /></IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
