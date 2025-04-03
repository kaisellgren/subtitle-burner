import Buffer from 'node:buffer'
import { $, tempfile } from 'zx'
import { promises as fs } from 'fs'
import { Logger } from './logger'

const logger = new Logger(import.meta.url)

export async function createThumbnail(fullPath: string, videoDuration: number): Promise<Buffer> {
  logger.debug(`Creating thumbnail for: ${fullPath}`)

  const thumbnailFile = `${tempfile()}.avif`

  await $`ffmpeg -ss ${Math.round(videoDuration / 2)} -noaccurate_seek -i ${fullPath} -read_ahead_limit 1 -skip_frame nokey -an -vf "thumbnail,scale=320:-1" -frames:v 1 -c:v libaom-av1 -crf 40 -still-picture 1 ${thumbnailFile}`.quiet()

  return fs.readFile(thumbnailFile)
}

export async function createDataUriThumbnail(fullPath: string, videoDuration: number): Promise<string> {
  const data = await createThumbnail(fullPath, videoDuration)
  return `data:image/avif;base64,${data.toString('base64')}`
}
