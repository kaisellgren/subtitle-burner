import { VideoInfo } from '../../common/video-info'

export interface BurnSettings {
  subtitleId: string | null
}

interface VideoBurnDates {
  burnStartedAt: Date | null
  burnFinishedAt: Date | null
  burnFailedAt: Date | null
}

export interface Video extends VideoInfo, VideoBurnDates {
  burnSettings: BurnSettings
  burnProgressRate: number
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

export function isBurning(x: VideoBurnDates): boolean {
  return x.burnStartedAt != null && x.burnFailedAt == null && x.burnFinishedAt == null
}
