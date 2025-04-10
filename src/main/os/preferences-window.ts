import { BrowserWindow } from 'electron'
import path from 'node:path'
import { APP_ICON } from './app-icon'

export async function openPreferences(): Promise<void> {
  const win = new BrowserWindow({
    width: 1024,
    height: 800,
    title: 'Preferences',
    autoHideMenuBar: true,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      defaultEncoding: 'utf-8',
    },
    icon: APP_ICON,
  })

  if (process.env['NODE_ENV'] == 'development') {
    void win.loadURL('http://localhost:5173/index.html?window=preferences')
  } else {
    void win.loadFile(path.join(__dirname, '../renderer/index.html'), { query: { window: 'preferences' } })
  }
}
