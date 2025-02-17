import { $ } from 'zx'
import { VideoInfo } from '../../common/video-info'
import { basename, dirname, extname } from 'node:path'
import { promises as fs } from 'fs'
import {  } from 'node:buffer'

export async function getVideoInfo(path: string): Promise<VideoInfo> {
  const stat = await fs.stat(path)

  if (!stat.isFile()) {
    throw new Error(`Expected a file: ${path}`)
  }

  const result = await $`ffprobe -v quiet -print_format json -show_format -show_streams ${path}`

  const info = JSON.parse(result.stdout)

  const videoTrack = info.streams.find((x) => x.codec_type == 'video')
  if (videoTrack == null) {
    throw new Error(`Could not find video track for: ${path}`)
  }

  const subTracks = info.streams.filter((x) => x.codec_type == 'subtitle')

  const durationInSeconds = Math.round(Number(info.format.duration))

  return {
    filename: basename(path),
    path: dirname(path),
    extension: extname(path),
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
    subtitles: subTracks.map((x) => ({
      language: x.tags.language,
      title: x.tags.title,
    })),
  }
}

function parseFrameRate(value: string): number {
  const [a, b] = value.split('/').map(Number)
  return a / b
}

export async function getThumbnail(path: string): Promise<string> {
  const result = await $`ffmpeg -i ${path} -an -vf "thumbnail,scale=320:-1" -frames:v 1 -f image2 pipe:1`
  return result.buffer().toString('base64url')
}
