import React from 'react'
import { createRoot } from 'react-dom/client'
import { Bootstrap } from './bootstrap'
import { ApiClient } from './api-client'

const apiClient = new ApiClient(window.electron)

apiClient.getSettings().then((settings) => {
  createRoot(document.body).render(<Bootstrap apiClient={apiClient} initialSettings={settings} />)
})
