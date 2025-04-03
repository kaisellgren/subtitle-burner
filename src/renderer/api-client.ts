import { StopBurningSubtitleRequest } from '../common/stop-burning-subtitle-request'
import { Video } from './video/video'
import { Settings } from '../common/settings'
import { VideoInfo } from '../common/video-info'
import { BurnSubtitleRequest } from '../common/burn-subtitle-request'
import { VideoBurnedEvent } from '../common/video-burned-event'
import { VideoBurnProgressEvent } from '../common/video-burn-progress-event'
import { VideoBurnFailedEvent } from '../common/video-burn-failed-event'

declare global {
  interface ElectronApi {
    getFilePath: (file: File) => string
    invoke<T, R>(channel: string, data: R): Promise<T>
    onCustomEvent<T>(eventName: string, callback: (data: T) => void): void
  }

  interface Window {
    electron: ElectronApi
  }
}

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

  async burnSubtitle(video: Video): Promise<void> {
    const request: BurnSubtitleRequest = {
      fullPath: video.fullPath,
      subtitleId: video.burnSettings.subtitleId,
      duration: video.durationInSeconds,
    }
    video.burnStartedAt = new Date()
    video.burnFinishedAt = null
    video.burnFailedAt = null
    await this.#electron.invoke('burnSubtitle', request)
  }

  onVideoBurned(fn: (event: VideoBurnedEvent) => void): void {
    this.#electron.onCustomEvent('video-burned', fn)
  }

  onVideoBurnFailed(fn: (event: VideoBurnFailedEvent) => void): void {
    this.#electron.onCustomEvent('video-burn-failed', fn)
  }

  onVideoBurnProgress(fn: (event: VideoBurnProgressEvent) => void): void {
    this.#electron.onCustomEvent('video-burn-progress', fn)
  }

  getFilePath(file: File): string {}
}
