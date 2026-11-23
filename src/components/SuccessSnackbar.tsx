import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';

type Severity = 'success' | 'error' | 'info';
type Notify = (message: string, severity?: Severity) => void;

const NotifyContext = createContext<Notify>(() => undefined);

/** Call notify('Saved') from any page to show a toast. */
export const useNotify = () => useContext(NotifyContext);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; message: string; severity: Severity }>({
    open: false, message: '', severity: 'success',
  });

  const notify = useCallback<Notify>((message, severity = 'success') => {
    setState({ open: true, message, severity });
  }, []);

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={state.severity} variant="filled" onClose={() => setState((s) => ({ ...s, open: false }))}>
          {state.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
}
