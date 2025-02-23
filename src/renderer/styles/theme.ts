import { buttonClasses, createTheme } from '@mui/material'

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
          [`&.${buttonClasses.contained}.${buttonClasses.colorSecondary}`]: {
            backgroundColor: '#ccc',
            '&:hover': {
              backgroundColor: '#ddd',
            },
          },
        },
      },
    },
  },
})
