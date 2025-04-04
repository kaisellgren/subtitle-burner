import React from 'react'
import { GlobalStyle } from './styles/global-styles'
import { Application } from './application'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import { DARK_THEME } from './styles/theme'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { createStore } from './store'
import { Settings } from '../common/settings'
import { ApiClient } from './api-client'

interface Props {
  apiClient: ApiClient
  initialSettings: Settings
}

export function Bootstrap({ initialSettings, apiClient }: Props) {
  return (
    <MuiThemeProvider theme={DARK_THEME}>
      <StyledComponentsThemeProvider theme={DARK_THEME}>
        <CssBaseline />
        <GlobalStyle />
        <Application apiClient={apiClient} store={createStore(initialSettings)} />
      </StyledComponentsThemeProvider>
    </MuiThemeProvider>
  )
}
