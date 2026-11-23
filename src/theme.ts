import { createTheme } from '@mui/material/styles';

// ---- design tokens
export const NAVY = '#0B2545';
export const NAVY_DARK = '#081C36';
export const BLUE = '#1D5FD1';
export const HEADER_HEIGHT = 56;
export const BORDER = '#D9E2EF';
export const BORDER_SOFT = '#E6EDF7';
export const SLATE_900 = '#0F172A';
export const TINT_BLUE = '#E6EFFD';
export const PAGE_BG = '#EDF2F9';

const FONT = '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const theme = createTheme({
  palette: {
    primary: { main: BLUE, dark: '#154AA8', light: TINT_BLUE, contrastText: '#FFFFFF' },
    secondary: { main: '#6B4FBB' },
    success: { main: '#17803D' },
    warning: { main: '#B45309' },
    error: { main: '#C0362C' },
    background: { default: PAGE_BG, paper: '#FFFFFF' },
    text: { primary: '#1E293B', secondary: '#5B6B82' },
    divider: BORDER,
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: FONT,
    h4: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontSize: '1rem', fontWeight: 700 },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.8125rem', fontWeight: 600 },
    body1: { fontSize: '0.9375rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.78rem' },
    button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: PAGE_BG, WebkitFontSmoothing: 'antialiased' },
        'a:not([class])': { color: BLUE, textDecoration: 'none', fontWeight: 600 },
        'a:not([class]):hover': { textDecoration: 'underline' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, minHeight: 38, padding: '6px 16px' },
        sizeSmall: { minHeight: 32, padding: '4px 12px', fontSize: '0.8125rem' },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
      },
    },
    MuiIconButton: { styleOverrides: { sizeSmall: { padding: 5 } } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', borderRadius: 8, fontSize: '0.875rem',
          '& fieldset': { borderColor: '#BCC9DC' },
          '&.Mui-disabled': { backgroundColor: '#F1F5F9' },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: '0.875rem' } } },
    MuiFormLabel: { styleOverrides: { asterisk: { color: '#C0362C' } } },
    MuiFormHelperText: { styleOverrides: { root: { marginLeft: 2, fontSize: '0.75rem' } } },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, border: `1px solid ${BORDER}`, boxShadow: '0 1px 3px rgba(11,37,69,0.08)' },
      },
    },
    MuiCardContent: { styleOverrides: { root: { padding: 16, '&:last-child': { paddingBottom: 16 } } } },
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '13px 11px', fontSize: '0.875rem', borderBottom: `1px solid ${BORDER_SOFT}`, whiteSpace: 'nowrap' },
        sizeSmall: { padding: '9px 12px' },
        // dark navy header row with white text
        head: {
          backgroundColor: '#14355F', color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem',
          textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none',
        },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } } },
    // filled "pill" tabs: the selected tab is solid blue
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44, backgroundColor: '#E6EDF8', borderRadius: 10, padding: 5 },
        indicator: { display: 'none' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 34, padding: '6px 16px', fontSize: '0.875rem', fontWeight: 600, borderRadius: 8, color: '#34506F',
          '&.Mui-selected': { backgroundColor: BLUE, color: '#FFFFFF', boxShadow: '0 2px 6px rgba(29,95,209,0.35)' },
        },
      },
    },
    MuiTooltip: { styleOverrides: { tooltip: { backgroundColor: SLATE_900, fontSize: '0.75rem', borderRadius: 6 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 12 } } },
    MuiDialogTitle: { styleOverrides: { root: { fontSize: '1.0625rem', fontWeight: 700, padding: '18px 24px 8px', color: NAVY } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 8, fontSize: '0.875rem' } } },
    MuiBreadcrumbs: { styleOverrides: { root: { fontSize: '0.8125rem' } } },
    MuiStepLabel: { styleOverrides: { label: { fontSize: '0.8125rem', fontWeight: 600 } } },
  },
});
