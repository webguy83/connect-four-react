import { Theme, ThemeOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    mdlg: true;
    lg: true;
    xl: true;
  }
}

const themeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      mdlg: 1080,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: (palette) => ({
    fontFamily: ['Space Grotesk', 'sans-serif'].join(','),
    htmlFontSize: 10,
    h2: {
      fontSize: '5.6rem',
      textTransform: 'uppercase',
      fontWeight: 700,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      color: palette.primary.light,
    },
  }),
  palette: {
    primary: {
      light: '#7945FF',
      main: '#5C2DD5',
      dark: '#000000',
    },
    secondary: {
      light: '#FFFFFF',
      main: '#FFCE67',
      dark: '#FD6687',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme: Theme) => ({
        body: {
          backgroundColor: theme.palette.primary.light,
        },
      }),
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontSize: '2.4rem',
          fontWeight: 700,
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '& circle': {
            transition: 'fill .25s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:hover circle': {
            transition: 'fill .25s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
  },
};

export default themeOptions;
