import { basename, dirname } from 'node:path'
import { $ } from 'zx'
import { VideoBurnedEvent } from '../common/video-burned-event'
import { sha256 } from './util/hash'
import { VideoBurnProgressEvent } from '../common/video-burn-progress-event'
import { sanitizeFilenameForFfmpeg } from './util/shell'
import { extractSubtitleToTempFile } from './util/video'
import { fileExists } from './util/fs'
import { promises as fs } from 'node:fs'
import { VideoBurnFailedEvent } from '../common/video-burn-failed-event'

export class SubtitleBurner {
  constructor(private win: Electron.CrossProcessExports.BrowserWindow) {}

  async burn(fullPath: string, subtitleId: string, duration: number) {
    const id = sha256(fullPath)

    const subtitleIndex = Number(subtitleId)

    const subtitleFullPath = await extractSubtitleToTempFile(fullPath, subtitleIndex)
    const outputFullPath = `${dirname(fullPath)}/(burned) ${sanitizeFilenameForFfmpeg(basename(fullPath))}`

    if (await fileExists(outputFullPath)) {
      await fs.rm(outputFullPath)
    }

    const process =
      $`ffmpeg -i ${fullPath} -vf subtitles=${subtitleFullPath} -c:v libx264 -b:v 5M -preset ultrafast -movflags +faststart -crf 21 -tune film -c:a copy ${outputFullPath}`.quiet()

    process.stderr.on('data', (data) => {
      const output = data.toString()
      const match = output.match(/time=([^ ]+)/)
      if (match) {
        const [hours, minutes, seconds] = match[1].slice(0, 8).split(':').map(Number)
        const progressInSeconds = seconds + minutes * 60 + hours * 3600

        const event: VideoBurnProgressEvent = {
          id: id,
          progressRate: Number((progressInSeconds / duration).toFixed(2)),
        }

        this.win.webContents.send('video-burn-progress', event)
      }
    })

    try {
      await process
    } catch (error) {
      console.error('Could not burn subtitle onto video', error)
      const event: VideoBurnFailedEvent = {
        id,
        error: error instanceof Error ? error.message : String(error),
      }
      this.win.webContents.send('video-burn-failed', event)
      return
    }

    const event: VideoBurnedEvent = { id }

    this.win.webContents.send('video-burned', event)
  }
}
