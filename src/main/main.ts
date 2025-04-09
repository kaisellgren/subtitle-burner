import { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, Tray } from 'electron'
import path from 'node:path'
import icon256 from '../assets/icons/icon-256x256.png'
import { StateManager } from './state/state-manager'
import { createMenu } from './menu'
import { getVideoInfo } from './util/video'
import { BurnSubtitleRequest } from '../common/burn-subtitle-request'
import { SubtitleBurner } from './subtitle-burner'
import { Logger } from './util/logger'
import { StopBurningSubtitleRequest } from '../common/stop-burning-subtitle-request'
import { isSupportedFileType, SUPPORTED_FILE_TYPES } from '../common/video'
import { findFiles } from './util/file-finder'

const logger = new Logger(import.meta.url)

async function main() {
  logger.info('Starting application')
  await app.whenReady()
  logger.info('Application started')

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

  const subtitleBurner = new SubtitleBurner(win)

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

  const tray = new Tray(icon)
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Exit',
        click: () => app.quit(),
      },
    ]),
  )

  ipcMain.handle('selectFiles', async (_) => {
    const result = await dialog.showOpenDialog({
      title: 'Choose files',
      buttonLabel: 'Add files',
      filters: [
        {
          name: '',
          extensions: SUPPORTED_FILE_TYPES,
        },
      ],
      properties: ['openFile', 'multiSelections'],
    })

    return (result.filePaths ?? []).filter(isSupportedFileType)
  })

  ipcMain.handle('selectDirectories', async (_) => {
    const result = await dialog.showOpenDialog({
      title: 'Choose folders',
      buttonLabel: 'Add folders',
      properties: ['openDirectory', 'multiSelections'],
    })

    return result.filePaths ?? []
  })

  ipcMain.handle('findVideoFiles', async (_, fullPath) => {
    try {
      return await findFiles(fullPath, SUPPORTED_FILE_TYPES)
    } catch (error) {
      logger.error(`Could not find files: ${fullPath}`, error)
    }
    return []
  })

  ipcMain.handle('getVideoInfo', async (_, fullPath) => {
    try {
      return await getVideoInfo(fullPath)
    } catch (error) {
      logger.error(`Could not retrieve video info: ${fullPath}`, error)
    }
    return null
  })

  ipcMain.handle('getSettings', async (_) => state.settings)

  ipcMain.handle('burnSubtitle', (_, request: BurnSubtitleRequest) => {
    try {
      void subtitleBurner.burn(request.fullPath, request.subtitleId, request.duration)
    } catch (error) {
      logger.error(`Could not burn subtitle onto video: ${request.fullPath}`, error)
    }
  })

  ipcMain.handle('stopBurningSubtitle', async (_, request: StopBurningSubtitleRequest) => {
    try {
      await subtitleBurner.stop(request.fullPath)
    } catch (error) {
      logger.error(`Could not stop subtitle from being burned: ${request.fullPath}`, error)
    }
  })

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
