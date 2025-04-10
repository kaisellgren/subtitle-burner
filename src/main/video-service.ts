import { Cache } from './cache'
import { SubtitleBurner } from './ffmpeg/subtitle-burner'
import { getVideoInfo } from './ffmpeg/video-analyzer'

export class VideoService {
  #cache: Cache
  #subtitleBurner: SubtitleBurner

  constructor(cache: Cache, subtitleBurner: SubtitleBurner) {
    this.#cache = cache
    this.#subtitleBurner = subtitleBurner
  }

  async getVideoInfo(fullPath: string) {
    return await this.#cache.getOrRetrieve(`getVideoInfo-${fullPath}`, async () => await getVideoInfo(fullPath))
  }

  async burnSubtitle(fullPath: string, subtitleId: string, duration: number) {
    await this.#subtitleBurner.burn(fullPath, subtitleId, duration)
  }

  async stopBurningSubtitle(fullPath: string) {
    await this.#subtitleBurner.stop(fullPath)
  }
}
