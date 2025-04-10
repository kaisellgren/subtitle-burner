import electron, { dialog } from 'electron'
import { isSupportedFileType, SUPPORTED_FILE_TYPES } from '../common/video'
import { dirname } from 'node:path'
import { BurnSubtitleRequest } from '../common/burn-subtitle-request'
import { StopBurningSubtitleRequest } from '../common/stop-burning-subtitle-request'
import { Logger } from './util/logger'
import { State } from './state/state'
import { StateManager } from './state/state-manager'
import { VideoService } from './video-service'
import { FileService } from './file-service'

const logger = new Logger(import.meta.url)

export class Api {
  #ipc: electron.IpcMain
  #state: State
  #stateManager: StateManager
  #videoService: VideoService
  #fileService: FileService

  constructor(
    ipc: electron.IpcMain,
    state: State,
    stateManager: StateManager,
    videoService: VideoService,
    fileService: FileService,
  ) {
    this.#ipc = ipc
    this.#state = state
    this.#stateManager = stateManager
    this.#videoService = videoService
    this.#fileService = fileService

    this.#ipc.handle('selectFiles', this.#selectFiles)
    this.#ipc.handle('selectDirectories', this.#selectDirectories)
    this.#registerApi('findVideoFiles', (fullPath: string) => this.#fileService.findVideoFiles(fullPath))
    this.#registerApi('getSettings', async () => this.#state.settings)
    this.#registerApi('getVideoInfo', (fullPath: string) => this.#videoService.getVideoInfo(fullPath))
    this.#registerApi('burnSubtitle', (request: BurnSubtitleRequest) =>
      this.#videoService.burnSubtitle(request.fullPath, request.subtitleId, request.duration),
    )
    this.#registerApi('stopBurningSubtitle', (request: StopBurningSubtitleRequest) =>
      this.#videoService.stopBurningSubtitle(request.fullPath),
    )
  }

  #registerApi<T>(method: string, fn: (data: T) => Promise<unknown>) {
    this.#ipc.handle(method, async (_: electron.IpcMainInvokeEvent, data: T) => {
      try {
        return await fn(data)
      } catch (error) {
        logger.error(`Failed to call '${method}' with data: ${data}`, error)
      }
      return null
    })
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
}
