import { Cache } from './cache'
import { SubtitleBurner } from './ffmpeg/subtitle-burner'
import { promises as fs } from 'fs'
import { $ } from 'zx'
import { createDataUriThumbnail } from './ffmpeg/thumbnail'
import { sha256 } from './util/hash'
import { basename, dirname, extname } from 'node:path'
import { Subtitle, VideoInfo } from '../common/video-info'
import { Logger } from './util/logger'

const logger = new Logger(import.meta.url)

export class VideoService {
  #cache: Cache
  #subtitleBurner: SubtitleBurner

  constructor(cache: Cache, subtitleBurner: SubtitleBurner) {
    this.#cache = cache
    this.#subtitleBurner = subtitleBurner
  }

  async getVideoInfo(fullPath: string) {
    return await this.#cache.getOrRetrieve(`getVideoInfo-${fullPath}`, async (): Promise<VideoInfo> => {
      logger.info(`Retrieving video info: ${fullPath}`)

      const stat = await fs.stat(fullPath)

      if (!stat.isFile()) {
        throw new Error(`Expected a file: ${fullPath}`)
      }

      const result = await $`ffprobe -v quiet -print_format json -show_format -show_streams ${fullPath}`.quiet()

      const info = JSON.parse(result.stdout)

      logger.debug(`Fetched video info: ${JSON.stringify(info)}`)

      const videoTrack = info.streams.find((x: any) => x.codec_type == 'video')
      if (videoTrack == null) {
        throw new Error(`Could not find video track for: ${fullPath}`)
      }

      logger.debug(`Found video track: ${JSON.stringify(videoTrack)}`)

      const subTracks = info.streams.filter((x: any) => x.codec_type == 'subtitle')

      const durationInSeconds = Math.round(Number(info.format.duration))

      const thumbnail = await createDataUriThumbnail(fullPath, durationInSeconds)

      const data = {
        id: sha256(fullPath),
        fullPath,
        filename: basename(fullPath),
        path: dirname(fullPath),
        extension: extname(fullPath),
        sizeInBytes: Number(info.format.size),
        createdAt: stat.ctime,
        formatName: info.format.format_long_name,
        durationInSeconds,
        frameRate: parseFrameRate(videoTrack.avg_frame_rate),
        bitRate: Number(info.format.bit_rate),
        videoCodec: videoTrack.codec_name,
        width: videoTrack.width,
        height: videoTrack.height,
        aspectRatio: videoTrack.display_aspect_ratio,
        thumbnail: thumbnail,
        subtitles: subTracks.map((x: any, i: number): Subtitle => {
          return {
            id: String(i),
            language: x.tags.language,
            title: x.tags.title,
          }
        }),
      }

      logger.debug(`Returning video info: ${JSON.stringify(data)}`)

      return data
    })
  }

  async burnSubtitle(fullPath: string, subtitleId: string, duration: number) {
    await this.#subtitleBurner.burn(fullPath, subtitleId, duration)
  }

  async stopBurningSubtitle(fullPath: string) {
    await this.#subtitleBurner.stop(fullPath)
  }
}

function parseFrameRate(value: string): number {
  logger.debug(`Parsing frame rate from value: ${value}`)
  const [a, b] = value.split('/').map(Number)
  return Number(((a ?? 0) / (b ?? 0)).toFixed(2))
}
