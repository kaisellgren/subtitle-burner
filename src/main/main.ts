import { app } from 'electron'
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

  createMenu()
  createSystemTray()
  const win = createMainWindow(stateManager)

  const cache = new Cache()
  const fileService = new FileService(stateManager)
  const subtitleBurner = new SubtitleBurner(win, stateManager)
  const videoService = new VideoService(cache, subtitleBurner)

  new Api(stateManager, videoService, fileService)
}

try {
  void main()
} catch (error) {
  logger.error('Application crashed unexpectedly', error)
}
