import { VideoInfo } from '../../common/video-info'

export interface BurnSettings {
  subtitleId: string | null
}

export interface Video extends VideoInfo {
  burnSettings: BurnSettings
  burnProgressRate: number
  burnStartedAt: Date | null
  burnFinishedAt: Date | null
  burnFailedAt: Date | null
  burnError: string
}

export function toVideo(x: VideoInfo): Video {
  return {
    ...x,
    burnSettings: {
      subtitleId: null,
    },
    burnProgressRate: 0,
    burnStartedAt: null,
    burnFinishedAt: null,
    burnFailedAt: null,
    burnError: '',
  }
}
