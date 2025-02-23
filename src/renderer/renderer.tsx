import React from 'react'
import { createRoot } from 'react-dom/client'
import { Bootstrap } from './bootstrap'
import { Settings } from '../common/settings'

window.electron.invoke<Settings>('getSettings', null).then((settings) => {
  createRoot(document.body).render(<Bootstrap initialSettings={settings} />)
})
