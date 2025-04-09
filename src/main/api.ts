import electron, { dialog } from 'electron'
import { isSupportedFileType, SUPPORTED_FILE_TYPES } from '../common/video'
import { dirname } from 'node:path'
import { findFiles } from './util/file-finder'
import { getVideoInfo } from './ffmpeg/video'
import { BurnSubtitleRequest } from '../common/burn-subtitle-request'
import { StopBurningSubtitleRequest } from '../common/stop-burning-subtitle-request'
import { SubtitleBurner } from './ffmpeg/subtitle-burner'
import { Logger } from './util/logger'
import { State } from './state/state'
import { StateManager } from './state/state-manager'

const logger = new Logger(import.meta.url)

export class Api {
  #ipc: electron.IpcMain
  #subtitleBurner: SubtitleBurner
  #state: State
  #stateManager: StateManager

  constructor(ipc: electron.IpcMain, subtitleBurner: SubtitleBurner, state: State, stateManager: StateManager) {
    this.#ipc = ipc
    this.#subtitleBurner = subtitleBurner
    this.#state = state
    this.#stateManager = stateManager

    this.#ipc.handle('selectFiles', this.#selectFiles)
    this.#ipc.handle('selectDirectories', this.#selectDirectories)
    this.#ipc.handle('findVideoFiles', this.#findVideoFiles)
    this.#ipc.handle('getVideoInfo', this.#getVideoInfo)
    this.#ipc.handle('getSettings', this.#getSettings)
    this.#ipc.handle('burnSubtitle', this.#burnSubtitle)
    this.#ipc.handle('stopBurningSubtitle', this.#stopBurningSubtitle)
  }

  #selectFiles = async (_: electron.IpcMainInvokeEvent) => {
    const result = await dialog.showOpenDialog({
      title: 'Choose files',
      buttonLabel: 'Add files',
      defaultPath: this.#state.mainWindow.lastOpenFileDialogPath,
      filters: [
        {
          name: '',
          extensions: SUPPORTED_FILE_TYPES,
        },
      ],
      properties: ['openFile', 'multiSelections'],
    })

    const first = result.filePaths[0]
    if (first) {
      this.#state.mainWindow.lastOpenFileDialogPath = dirname(first)
      await this.#stateManager.write(this.#state)
    }

    return (result.filePaths ?? []).filter(isSupportedFileType)
  }

  #selectDirectories = async (_: electron.IpcMainInvokeEvent) => {
    const result = await dialog.showOpenDialog({
      title: 'Choose folders',
      buttonLabel: 'Add folders',
      defaultPath: this.#state.mainWindow.lastOpenDirectoryDialogPath,
      properties: ['openDirectory', 'multiSelections'],
    })

    const first = result.filePaths[0]
    if (first) {
      this.#state.mainWindow.lastOpenDirectoryDialogPath = dirname(first)
      await this.#stateManager.write(this.#state)
    }

    return result.filePaths ?? []
  }

  #findVideoFiles = async (_: electron.IpcMainInvokeEvent, fullPath: string) => {
    try {
      return await findFiles(fullPath, SUPPORTED_FILE_TYPES)
    } catch (error) {
      logger.error(`Could not find files: ${fullPath}`, error)
    }
    return []
  }

  #getVideoInfo = async (_: electron.IpcMainInvokeEvent, fullPath: string) => {
    try {
      return await getVideoInfo(fullPath)
    } catch (error) {
      logger.error(`Could not retrieve video info: ${fullPath}`, error)
    }
    return null
  }

  #getSettings = async () => this.#state.settings

  #burnSubtitle = (_: electron.IpcMainInvokeEvent, request: BurnSubtitleRequest) => {
    try {
      void this.#subtitleBurner.burn(request.fullPath, request.subtitleId, request.duration)
    } catch (error) {
      logger.error(`Could not burn subtitle onto video: ${request.fullPath}`, error)
    }
  }

  #stopBurningSubtitle = async (_: electron.IpcMainInvokeEvent, request: StopBurningSubtitleRequest) => {
    try {
      await this.#subtitleBurner.stop(request.fullPath)
    } catch (error) {
      logger.error(`Could not stop subtitle from being burned: ${request.fullPath}`, error)
    }
  }
}
