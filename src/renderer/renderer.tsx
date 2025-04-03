import React from 'react'
import { createRoot } from 'react-dom/client'
import { Bootstrap } from './bootstrap'
import { ApiClient } from './api-client'
import { ElectronApi } from '../preload/preload'

const apiClient = new ApiClient((window as unknown as { electron: ElectronApi }).electron)

apiClient.getSettings().then((settings) => {
  createRoot(document.body).render(<Bootstrap apiClient={apiClient} initialSettings={settings} />)
})
