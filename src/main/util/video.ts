import { $ } from 'zx'
import { Subtitle, VideoInfo } from '../../common/video-info'
import { basename, dirname, extname } from 'node:path'
import { promises as fs } from 'fs'
import { createDataUriThumbnail } from './thumbnail'
import { sha256 } from './hash'
import { createTempFilename } from './fs'

export async function getVideoInfo(fullPath: string): Promise<VideoInfo> {
  const stat = await fs.stat(fullPath)

  if (!stat.isFile()) {
    throw new Error(`Expected a file: ${fullPath}`)
  }

  const result = await $`ffprobe -v quiet -print_format json -show_format -show_streams ${fullPath}`.quiet()

  const info = JSON.parse(result.stdout)

  const videoTrack = info.streams.find((x) => x.codec_type == 'video')
  if (videoTrack == null) {
    throw new Error(`Could not find video track for: ${fullPath}`)
  }

  const subTracks = info.streams.filter((x) => x.codec_type == 'subtitle')

  const durationInSeconds = Math.round(Number(info.format.duration))

  return {
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
    thumbnail: await createDataUriThumbnail(fullPath, durationInSeconds),
    subtitles: subTracks.map((x, i): Subtitle => {
      return {
        id: String(i),
        language: x.tags.language,
        title: x.tags.title,
      }
    }),
  }
}

export async function extractSubtitleToTempFile(fullPath: string, subtitleIndex: number): Promise<string> {
  const tempFile = createTempFilename('subtitle', '.srt')
  await $`ffmpeg -i ${fullPath} -map 0:s:${subtitleIndex} ${tempFile}`
  return tempFile
}

function parseFrameRate(value: string): number {
  const [a, b] = value.split('/').map(Number)
  return Number((a / b).toFixed(2))
}
