import { createTheme } from '@mui/material/styles';

/**
 * Brown-gold BRUTALIST MUI theme — the single source of truth for every
 * interactive surface (buttons, inputs, dialogs, chips, tables, tooltips).
 *
 * The palette is unchanged from the original brown-gold system; what changed
 * is the treatment: zero radius, thick brand-900 borders, hard (no-blur)
 * offset shadows, flat fills and a monospace/grotesque type stack.
 *
 * Palette values mirror the Tailwind brand/gold scales defined in
 * app/globals.css; keep the two in sync.
 */

const brand = {
    50: '#fbf7f2',
    100: '#f3e9de',
    200: '#e3cdb6',
    300: '#cda985',
    400: '#b0855b',
    500: '#8b5e34',
    600: '#7a5230',
    700: '#5f3f25',
    800: '#46301d',
    900: '#2c2017',
    950: '#1c140e',
};

const gold = {
    100: '#f4eac4',
    200: '#e9d38c',
    300: '#ddbc56',
    400: '#cfa432',
    500: '#b8860b',
    600: '#9a6f09',
    700: '#7c5807',
};

const ink = brand[950];

// Hard, no-blur offset shadows — the defining brutalist treatment.
const hardShadow = `4px 4px 0 0 ${ink}`;
const hardShadowHover = `6px 6px 0 0 ${ink}`;
const hardShadowDialog = `12px 12px 0 0 ${ink}`;

const mono = 'var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace';
const display = 'var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif';

const heading = {
    fontFamily: display,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '-0.02em',
};

export const theme = createTheme({
    cssVariables: true,
    shape: {
        borderRadius: 0,
    },
    palette: {
        mode: 'light',
        primary: {
            main: brand[700],
            light: brand[500],
            dark: brand[900],
            contrastText: '#ffffff',
        },
        secondary: {
            main: gold[500],
            light: gold[300],
            dark: gold[700],
            contrastText: ink,
        },
        error: {
            main: '#b3261e',
        },
        warning: {
            main: gold[600],
        },
        success: {
            main: '#3f7d4e',
        },
        background: {
            default: '#f3ece0',
            paper: '#faf7f0',
        },
        text: {
            primary: ink,
            secondary: brand[600],
        },
        divider: brand[900],
    },
    typography: {
        fontFamily: mono,
        h1: heading,
        h2: heading,
        h3: heading,
        h4: heading,
        h5: heading,
        h6: heading,
        button: {
            fontFamily: mono,
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.06em',
        },
        overline: {
            fontFamily: mono,
            letterSpacing: '0.18em',
            fontWeight: 700,
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
                disableRipple: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    paddingInline: 20,
                    border: `2px solid ${ink}`,
                    transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
                    '&:active': {
                        transform: 'translate(2px, 2px)',
                        boxShadow: 'none',
                    },
                },
            },
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        backgroundColor: brand[700],
                        color: '#ffffff',
                        boxShadow: hardShadow,
                        '&:hover': {
                            backgroundColor: brand[800],
                            boxShadow: hardShadowHover,
                            transform: 'translate(-1px, -1px)',
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        backgroundColor: gold[400],
                        color: ink,
                        boxShadow: hardShadow,
                        '&:hover': {
                            backgroundColor: gold[500],
                            boxShadow: hardShadowHover,
                            transform: 'translate(-1px, -1px)',
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'primary' },
                    style: {
                        borderColor: ink,
                        borderWidth: 2,
                        backgroundColor: 'transparent',
                        boxShadow: hardShadow,
                        '&:hover': {
                            borderColor: ink,
                            backgroundColor: brand[50],
                            boxShadow: hardShadowHover,
                            transform: 'translate(-1px, -1px)',
                        },
                    },
                },
                {
                    props: { variant: 'text' },
                    style: {
                        border: '2px solid transparent',
                        boxShadow: 'none',
                        '&:active': {
                            transform: 'none',
                        },
                    },
                },
            ],
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: ink,
                        borderWidth: 2,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: ink,
                        borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: gold[500],
                        borderWidth: 3,
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: mono,
                    '&.Mui-focused': {
                        color: gold[700],
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                    border: `3px solid ${ink}`,
                    boxShadow: hardShadowDialog,
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(28, 20, 14, 0.6)',
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontFamily: display,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    fontSize: '1.5rem',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    fontFamily: mono,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    border: `2px solid ${ink}`,
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `2px solid ${ink}`,
                },
                head: {
                    backgroundColor: brand[900],
                    color: gold[200],
                    fontFamily: mono,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: ink,
                    fontFamily: mono,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderRadius: 0,
                    border: `2px solid ${ink}`,
                },
                arrow: {
                    color: ink,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    border: `2px solid ${ink}`,
                    fontFamily: mono,
                },
            },
        },
        MuiCircularProgress: {
            defaultProps: {
                color: 'secondary',
            },
        },
    },
});

export default theme;
