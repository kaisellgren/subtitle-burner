import { Cache } from './cache'
import { SubtitleBurner } from './subtitle-burner'
import { promises as fs } from 'fs'
import { $, tempfile } from 'zx'
import { sha256 } from './util/hash'
import { basename, dirname, extname } from 'node:path'
import { Subtitle, VideoInfo } from '../common/video-info'
import { Logger } from './util/logger'
import type { Buffer } from 'node:buffer'
import { findSubtitleFilesForVideo } from './util/subtitle-file-finder'

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

      const subtitles: Subtitle[] = subTracks.map((x: any, i: number): Subtitle => {
        return {
          id: String(i),
          index: i,
          language: x.tags.language,
          title: x.tags.title,
        }
      })

      if (subtitles.length == 0) {
        subtitles.push(...(await findSubtitleFilesForVideo(fullPath)))
      }

      const durationInSeconds = Math.round(Number(info.format.duration))

      const thumbnail = await this.#createDataUriThumbnail(fullPath, durationInSeconds)

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
        subtitles,
      }

      logger.debug(`Returning video info: ${JSON.stringify(data)}`)

      return data
    })
  }

  async burnSubtitle(fullPath: string, subtitlePathOrIndex: string | number) {
    const videoInfo = await this.getVideoInfo(fullPath)
    await this.#subtitleBurner.burn(fullPath, subtitlePathOrIndex, videoInfo)
  }

  async stopBurningSubtitle(fullPath: string) {
    await this.#subtitleBurner.stop(fullPath)
  }

  async #createDataUriThumbnail(fullPath: string, videoDuration: number): Promise<string> {
    const data = await this.#createThumbnail(fullPath, videoDuration)
    return `data:image/avif;base64,${data.toString('base64')}`
  }

  async #createThumbnail(fullPath: string, videoDuration: number): Promise<Buffer> {
    logger.debug(`Creating thumbnail for: ${fullPath}`)

    const thumbnailFile = `${tempfile()}.avif`

    await $`ffmpeg -ss ${Math.round(videoDuration / 2)} -noaccurate_seek -i ${fullPath} -read_ahead_limit 1 -skip_frame nokey -an -vf "thumbnail,scale=320:-1" -frames:v 1 -c:v libaom-av1 -crf 40 -still-picture 1 ${thumbnailFile}`.quiet()

    return fs.readFile(thumbnailFile)
  }
}

function parseFrameRate(value: string): number {
  logger.debug(`Parsing frame rate from value: ${value}`)
  const [a, b] = value.split('/').map(Number)
  return Number(((a ?? 0) / (b ?? 0)).toFixed(2))
}
