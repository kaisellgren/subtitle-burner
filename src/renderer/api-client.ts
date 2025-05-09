import { StopBurningSubtitleRequest } from '../common/stop-burning-subtitle-request'
import { Video } from './video/video'
import { Settings } from '../common/settings'
import { VideoInfo } from '../common/video-info'
import { BurnSubtitleRequest } from '../common/burn-subtitle-request'
import { VideoBurnedEvent } from '../common/video-burned-event'
import { VideoBurnProgressEvent } from '../common/video-burn-progress-event'
import { VideoBurnFailedEvent } from '../common/video-burn-failed-event'
import { ElectronApi } from '../preload/preload'
import { expectNotNull } from '../common/objects'

export class ApiClient {
  #electron: ElectronApi

  constructor(electron: ElectronApi) {
    this.#electron = electron
  }

  async stopBurningSubtitle(video: Video): Promise<void> {
    const request: StopBurningSubtitleRequest = {
      fullPath: video.fullPath,
    }
    await this.#electron.invoke('stopBurningSubtitle', request)
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

  async selectFiles(): Promise<string[]> {
    return await this.#electron.invoke<string[]>('selectFiles', null)
  }

  async selectDirectories(): Promise<string[]> {
    return await this.#electron.invoke<string[]>('selectDirectories', null)
  }

  async findVideoFiles(fullPath: string): Promise<string[]> {
    return await this.#electron.invoke<string[]>('findVideoFiles', fullPath)
  }

  async burnSubtitle(video: Video): Promise<void> {
    const subtitleId = expectNotNull(video.burnSettings.subtitleId, 'Expected subtitleId')
    const subtitle = expectNotNull(
      video.subtitles.find((x) => x.id == subtitleId),
      'Expected subtitle',
    )
    const request: BurnSubtitleRequest = {
      fullPath: video.fullPath,
      subtitlePathOrIndex: expectNotNull(subtitle.fullPath ?? subtitle.index, 'Expected either index or fullPath'),
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

  getFilePath(file: File): string {
    return this.#electron.getFilePath(file)
  }

  async saveSettings(settings: Settings): Promise<void> {
    await this.#electron.invoke('saveSettings', JSON.stringify(settings))
  }
}
