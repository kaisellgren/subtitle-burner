import React from 'react'
import { GlobalStyle } from './styles/global-styles'
import { Application } from './application'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import { DARK_THEME } from './styles/theme'
import CssBaseline from '@mui/material/CssBaseline'

export function Bootstrap() {
  return (
    <MuiThemeProvider theme={DARK_THEME}>
      <StyledComponentsThemeProvider theme={DARK_THEME}>
        <CssBaseline />
        <GlobalStyle />
        <Application />
      </StyledComponentsThemeProvider>
    </MuiThemeProvider>
  )
}
