import { app, BrowserWindow, ipcMain, nativeImage } from 'electron'
import path from 'node:path'
import icon256 from '../assets/icons/icon-256x256.png'
import { StateManager } from './state/state-manager'
import { createMenu } from './menu'
import { SubtitleBurner } from './ffmpeg/subtitle-burner'
import { Logger } from './util/logger'
import { Api } from './api'
import { createSystemTray } from './system-tray'
import { Cache } from './cache'

const logger = new Logger(import.meta.url)

async function main() {
  logger.info('Starting application')

  await app.whenReady()

  logger.info('Application started')

  const cache = new Cache()
  const stateManager = new StateManager()
  const state = await stateManager.read()

  const icon = nativeImage.createFromPath(path.join(__dirname, icon256 as string))

  const win = new BrowserWindow({
    width: state.mainWindow.bounds.width,
    height: state.mainWindow.bounds.height,
    x: state.mainWindow.bounds.x,
    y: state.mainWindow.bounds.y,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      defaultEncoding: 'utf-8',
    },
    icon,
  })

  const subtitleBurner = new SubtitleBurner(win, icon)

  createMenu()

  win.on('close', async () => {
    const bounds = win.getBounds()
    await stateManager.write({
      ...state,
      mainWindow: {
        ...state.mainWindow,
        bounds,
      },
    })
  })

  if (process.platform === 'linux' && app.dock != null) {
    app.dock.setIcon(icon)
  }

  createSystemTray(icon)

  new Api(ipcMain, subtitleBurner, state, stateManager, cache)

  if (process.env['NODE_ENV'] == 'development') {
    void win.loadURL('http://localhost:5173')
  } else {
    void win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

try {
  void main()
} catch (error) {
  logger.error('Application crashed unexpectedly', error)
}
