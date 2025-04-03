import { alertClasses, buttonClasses, createTheme } from '@mui/material'

export const DARK_THEME = createTheme({
  palette: {
    primary: {
      main: '#e94e06',
    },
    secondary: {
      main: '#ddd',
    },
    background: {
      default: '#1a1a1a',
      paper: '#222',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
    info: {
      main: '#006a9f',
    },
    mode: 'dark',
  },
  typography: {
    htmlFontSize: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          [`&.${buttonClasses.contained}.${buttonClasses.colorPrimary}`]: {
            backgroundColor: '#9a3100',
            '&:hover': {
              backgroundColor: '#bd3a00',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          [`&.${alertClasses.filled}.${alertClasses.colorInfo}`]: {
            color: '#fff',
          },
        },
      },
    },
  },
})

export type Theme = typeof DARK_THEME
