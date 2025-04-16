import electron, { ipcMain } from 'electron'
import { BurnSubtitleRequest } from '../common/burn-subtitle-request'
import { StopBurningSubtitleRequest } from '../common/stop-burning-subtitle-request'
import { Logger } from './util/logger'
import { VideoService } from './video-service'
import { FileService } from './file-service'
import { StateManager } from './state/state-manager'

const logger = new Logger(import.meta.url)

export class Api {
  constructor(stateManager: StateManager, videoService: VideoService, fileService: FileService) {
    this.#registerApi('selectFiles', () => fileService.selectFiles())
    this.#registerApi('selectDirectories', () => fileService.selectDirectories())
    this.#registerApi('findVideoFiles', (fullPath: string) => fileService.findVideoFiles(fullPath))
    this.#registerApi('getSettings', () => stateManager.state.settings)
    this.#registerApi('getVideoInfo', (fullPath: string) => videoService.getVideoInfo(fullPath))
    this.#registerApi('burnSubtitle', (request: BurnSubtitleRequest) =>
      videoService.burnSubtitle(request.fullPath, request.subtitleId),
    )
    this.#registerApi('stopBurningSubtitle', (request: StopBurningSubtitleRequest) =>
      videoService.stopBurningSubtitle(request.fullPath),
    )
    this.#registerApi('saveSettings', async (settings: string) => {
      stateManager.state.settings = JSON.parse(settings)
      await stateManager.save()
    })
  }

  #registerApi<T>(method: string, fn: (data: T) => unknown) {
    ipcMain.handle(method, async (_: electron.IpcMainInvokeEvent, data: T) => {
      try {
        return await fn(data)
      } catch (error) {
        logger.error(`Failed to call '${method}' with data: ${data}`, error)
      }
      return null
    })
  }
}
