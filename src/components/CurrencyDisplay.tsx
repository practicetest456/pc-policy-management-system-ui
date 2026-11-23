import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import { formatCurrency } from '../utils/format';

interface Props extends Omit<TypographyProps, 'children'> {
  value?: number | null;
}

export default function CurrencyDisplay({ value, ...rest }: Props) {
  return (
    <Typography component="span" variant="body2" {...rest}>
      {formatCurrency(value)}
    </Typography>
  );
}
