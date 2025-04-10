import { app, ipcMain, nativeImage } from 'electron'
import path from 'node:path'
import icon256 from '../assets/icons/icon-256x256.png'
import { StateManager } from './state/state-manager'
import { createMenu } from './os/menu'
import { SubtitleBurner } from './subtitle-burner'
import { Logger } from './util/logger'
import { Api } from './api'
import { createSystemTray } from './os/system-tray'
import { Cache } from './cache'
import { VideoService } from './video-service'
import { FileService } from './file-service'
import { createMainWindow } from './os/main-window'

const logger = new Logger(import.meta.url)

async function main() {
  logger.info('Starting application')

  await app.whenReady()

  logger.info('Application started')

  const stateManager = await StateManager.init()

  const icon = nativeImage.createFromPath(path.join(__dirname, icon256 as string))

  createMenu()
  createSystemTray(icon)
  const win = createMainWindow(stateManager, icon)

  const cache = new Cache()
  const fileService = new FileService(stateManager)
  const subtitleBurner = new SubtitleBurner(win, icon)
  const videoService = new VideoService(cache, subtitleBurner)

  new Api(ipcMain, stateManager, videoService, fileService)
}

try {
  void main()
} catch (error) {
  logger.error('Application crashed unexpectedly', error)
}
