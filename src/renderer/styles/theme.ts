import { createTheme } from '@mui/material'

export const DARK_THEME = createTheme({
  palette: {
    primary: {
      main: '#e94e06',
    },
    secondary: {
      main: '#9ae906',
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
})
