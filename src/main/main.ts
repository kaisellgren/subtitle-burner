import { app, BrowserWindow, ipcMain, nativeImage } from 'electron'
import path from 'node:path'
import icon256 from '../assets/icons/icon-256x256.png'
import { StateManager } from './state/state-manager'
import { createMenu } from './menu'
import { SubtitleBurner } from './subtitle-burner'
import { Logger } from './util/logger'
import { Api } from './api'
import { createSystemTray } from './system-tray'
import { Cache } from './cache'
import { VideoService } from './video-service'
import { FileService } from './file-service'

const logger = new Logger(import.meta.url)

async function main() {
  logger.info('Starting application')

  await app.whenReady()

  logger.info('Application started')

  const cache = new Cache()
  const stateManager = new StateManager()
  await stateManager.init()

  const icon = nativeImage.createFromPath(path.join(__dirname, icon256 as string))

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
    icon,
  })

  const fileService = new FileService(stateManager)
  const subtitleBurner = new SubtitleBurner(win, icon)
  const videoService = new VideoService(cache, subtitleBurner)

  createMenu()

  win.on('close', async () => {
    stateManager.state.mainWindow.bounds = win.getBounds()
    await stateManager.save()
  })

  if (process.platform === 'linux' && app.dock != null) {
    app.dock.setIcon(icon)
  }

  createSystemTray(icon)

  new Api(ipcMain, stateManager, videoService, fileService)

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
