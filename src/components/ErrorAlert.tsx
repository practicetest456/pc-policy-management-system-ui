import { Alert, AlertTitle, Button } from '@mui/material';

interface Props {
  message?: string | null;
  fieldErrors?: Record<string, string>;
  onRetry?: () => void;
}

/** Shows the message returned by Spring Boot, plus any field-level validation errors. */
export default function ErrorAlert({ message, fieldErrors, onRetry }: Props) {
  if (!message) return null;
  const entries = fieldErrors ? Object.entries(fieldErrors) : [];
  return (
    <Alert
      severity="error"
      sx={{ mb: 2 }}
      action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Retry</Button> : undefined}
    >
      <AlertTitle sx={{ mb: entries.length ? 0.5 : 0 }}>{message}</AlertTitle>
      {entries.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {entries.map(([field, text]) => (
            <li key={field}>{text}</li>
          ))}
        </ul>
      )}
    </Alert>
  );
}
