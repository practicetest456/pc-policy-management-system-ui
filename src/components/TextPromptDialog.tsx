import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  message?: string;
  label: string;
  required?: boolean;
  confirmLabel: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}

/** A confirm dialog with one text box (cancellation reason, approval note, rejection reason...). */
export default function TextPromptDialog({ open, title, message, label, required, confirmLabel, danger, loading, onConfirm, onCancel }: Props) {
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setText('');
      setTouched(false);
    }
  }, [open]);

  const missing = required && text.trim() === '';

  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {message && <DialogContentText sx={{ mb: 2 }}>{message}</DialogContentText>}
        <TextField
          autoFocus fullWidth multiline minRows={3} label={label} value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched && !!missing}
          helperText={touched && missing ? `${label} is required` : ' '}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button
          variant="contained" color={danger ? 'error' : 'primary'} disabled={loading}
          onClick={() => {
            setTouched(true);
            if (!missing) onConfirm(text);
          }}
        >
          {loading ? 'Working…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
