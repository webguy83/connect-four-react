import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import './App.css';
import MainMenu from './components/MainMenu/MainMenu';

const theme = createTheme({
  typography: {
    fontFamily: ['Space Grotesk', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      light: '#7945FF',
      main: '#5C2DD5',
      dark: '#000',
    },
    secondary: {
      light: '#FFF',
      main: '#FFCE67',
      dark: '#FD6687',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme: Theme) => ({
        body: {
          backgroundColor: theme.palette.primary.main,
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
          fontSize: 24,
          fontWeight: 700,
        },
      },
    },
  },
});

function App() {
  return (
    <div className='app'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainMenu />
      </ThemeProvider>
    </div>
  );
}

export default App;
