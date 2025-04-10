import path from 'node:path'
import { app, BrowserWindow } from 'electron'
import { StateManager } from '../state/state-manager'
import { APP_ICON } from './app-icon'

export function createMainWindow(stateManager: StateManager): BrowserWindow {
  const win = new BrowserWindow({
    width: stateManager.state.mainWindow.bounds.width,
    height: stateManager.state.mainWindow.bounds.height,
    x: stateManager.state.mainWindow.bounds.x,
    y: stateManager.state.mainWindow.bounds.y,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      defaultEncoding: 'utf-8',
    },
    icon: APP_ICON,
  })

  win.on('close', async () => {
    stateManager.state.mainWindow.bounds = win.getBounds()
    await stateManager.save()
  })

  app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
      app.quit()
    }
  })

  if (process.platform == 'linux' && app.dock != null) {
    app.dock.setIcon(APP_ICON)
  }

  if (process.env['NODE_ENV'] == 'development') {
    void win.loadURL('http://localhost:5173/index.html?window=application')
  } else {
    void win.loadFile(path.join(__dirname, '../renderer/index.html'), { query: { window: 'application' } })
  }

  return win
}
