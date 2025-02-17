import { createTheme } from '@mui/material'

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
})
