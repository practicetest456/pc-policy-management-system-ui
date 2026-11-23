import { MenuItem, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: 'text' | 'number' | 'date' | 'email';
  options?: { value: string | number; label: string }[];
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  uppercase?: boolean;
  fullRow?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

/** One input wired to React Hook Form. Shows the Zod validation message under the field. */
export default function FormField<T extends FieldValues>({
  control, name, label, type = 'text', options, multiline, rows, required, disabled, helperText, uppercase, fullRow, min, max, step,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const raw = field.value as unknown;
        const display = typeof raw === 'number' && Number.isNaN(raw) ? '' : (raw ?? '');
        return (
          <TextField
            inputRef={field.ref}
            name={field.name}
            onBlur={field.onBlur}
            value={display}
            label={label}
            type={options ? undefined : type}
            select={!!options}
            multiline={multiline}
            rows={rows}
            required={required}
            disabled={disabled}
            size="small"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? helperText}
            sx={fullRow ? { gridColumn: '1 / -1' } : undefined}
            slotProps={{
              inputLabel: type === 'date' ? { shrink: true } : undefined,
              htmlInput: { min, max, step },
            }}
            onChange={(event) => {
              const text = event.target.value;
              if (type === 'number') {
                field.onChange(text === '' ? NaN : Number(text));
              } else {
                field.onChange(uppercase ? text.toUpperCase() : text);
              }
            }}
          >
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        );
      }}
    />
  );
}
