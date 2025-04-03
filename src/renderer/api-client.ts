import { StopBurningSubtitleRequest } from '../common/stop-burning-subtitle-request'
import { Video } from './video/video'
import { Settings } from '../common/settings'
import { VideoInfo } from '../common/video-info'

export class ApiClient {
  #electron: ElectronApi

  constructor(electron: ElectronApi) {
    this.#electron = electron
  }

  async stopBurningSubtitle(video: Video): Promise<void> {
    const request: StopBurningSubtitleRequest = {
      fullPath: video.fullPath,
    }
    await window.electron.invoke('stopBurningSubtitle', request)
    video.burnStartedAt = null
    video.burnFinishedAt = null
    video.burnFailedAt = null
    video.burnProgressRate = 0
  }

  async getSettings(): Promise<Settings> {
    return await this.#electron.invoke<Settings>('getSettings', null)
  }

  async getVideoInfo(fullPath: string): Promise<VideoInfo> {
    return await this.#electron.invoke<VideoInfo>('getVideoInfo', fullPath)
  }
}
