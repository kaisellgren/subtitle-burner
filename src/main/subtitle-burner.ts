import { basename, dirname } from 'node:path'
import { $, ProcessPromise } from 'zx'
import { VideoBurnedEvent } from '../common/video-burned-event'
import { sha256 } from './util/hash'
import { VideoBurnProgressEvent } from '../common/video-burn-progress-event'
import { sanitizeFilenameForFfmpeg } from './util/shell'
import { createTempFilename, fileExists } from './util/fs'
import { promises as fs } from 'node:fs'
import { VideoBurnFailedEvent } from '../common/video-burn-failed-event'
import { Logger } from './util/logger'
import { Notification } from 'electron'
import { APP_ICON } from './os/app-icon'
import { VideoInfo } from '../common/video-info'
import { StateManager } from './state/state-manager'

const logger = new Logger(import.meta.url)

export class SubtitleBurner {
  #videosBeingBurned: Map<string, ProcessPromise> = new Map()
  #win: Electron.CrossProcessExports.BrowserWindow
  #stateManager: StateManager

  constructor(win: Electron.CrossProcessExports.BrowserWindow, stateManager: StateManager) {
    this.#win = win
    this.#stateManager = stateManager
  }

  async burn(fullPath: string, subtitleId: string, videoInfo: VideoInfo) {
    const id = sha256(fullPath)

    logger.info(`Starting to burn subtitle for video (${id}): ${fullPath}`)

    const subtitleIndex = Number(subtitleId)

    const subtitleFullPath = await this.#extractSubtitleToTempFile(fullPath, subtitleIndex)
    const outputFullPath = `${dirname(fullPath)}/(burned) ${sanitizeFilenameForFfmpeg(basename(fullPath))}`

    logger.info(`Target file path: ${outputFullPath}`)

    if (await fileExists(outputFullPath)) {
      logger.info(`Removing existing file`)
      await fs.rm(outputFullPath)
    }

    const maxBitrate = this.#stateManager.state.settings.maximumBitrate ?? 5_000_000
    const bitrate = Math.min(videoInfo.bitRate, maxBitrate)
    const encodingPreset = this.#stateManager.state.settings.encodingPreset ?? 'medium'

    const process =
      $`ffmpeg -i ${fullPath} -vf subtitles=${subtitleFullPath} -c:v libx264 -b:v ${bitrate} -preset ${encodingPreset} -movflags +faststart -crf 21 -tune film -c:a copy ${outputFullPath}`.quiet()

    this.#videosBeingBurned.set(fullPath, process)

    process.stderr.on('data', (data) => {
      const output = data.toString()
      logger.debug(`Burn status: ${output}`)
      const match = output.match(/time=([^ ]+)/)
      if (match) {
        const [hours, minutes, seconds] = match[1].slice(0, 8).split(':').map(Number)
        const progressInSeconds = seconds + minutes * 60 + hours * 3600

        const progressRate = Number((progressInSeconds / videoInfo.durationInSeconds).toFixed(2))
        const event: VideoBurnProgressEvent = { id: id, progressRate }

        this.#win.webContents.send('video-burn-progress', event)
      }
    })

    try {
      logger.info(`Burning subtitle onto video`)
      await process
    } catch (error) {
      if (this.#videosBeingBurned.has(fullPath)) {
        logger.error('Could not burn subtitle onto video', error)
        const event: VideoBurnFailedEvent = {
          id,
          error: error instanceof Error ? error.message : String(error),
        }
        this.#win.webContents.send('video-burn-failed', event)

        new Notification({
          title: 'FAIL: Subtitle failed to burn',
          body: `${basename(fullPath)}`,
          urgency: 'normal',
          icon: APP_ICON,
        }).show()
      }
      return
    }

    logger.info(`Burn finished: ${outputFullPath}`)

    const event: VideoBurnedEvent = { id }

    this.#win.webContents.send('video-burned', event)

    new Notification({
      title: 'Subtitle burned',
      body: `${basename(fullPath)}`,
      urgency: 'normal',
      icon: APP_ICON,
    }).show()
  }

  async stop(fullPath: string): Promise<void> {
    logger.info(`Stopping subtitle from being burned: ${fullPath}`)
    const process = this.#videosBeingBurned.get(fullPath)
    if (process) {
      this.#videosBeingBurned.delete(fullPath)
      await process.kill('SIGKILL')
    }
    logger.info(`Stopped burning subtitle: ${fullPath}`)
  }

  async #extractSubtitleToTempFile(fullPath: string, subtitleIndex: number): Promise<string> {
    const tempFile = createTempFilename('subtitle', '.srt')
    logger.info(`Extracting subtitle from: ${fullPath}`)
    await $`ffmpeg -i ${fullPath} -map 0:s:${subtitleIndex} ${tempFile}`.quiet()
    logger.info(`Subtitle extracted to: ${tempFile}`)
    return tempFile
  }
}
