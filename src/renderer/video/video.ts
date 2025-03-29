import { VideoInfo } from '../../common/video-info'

export interface Video extends VideoInfo {
  burnProgressRate: number
  burnStartedAt: Date | null
  burnFinishedAt: Date | null
  burnFailedAt: Date | null
  burnError: string
}

export function toVideo(x: VideoInfo): Video {
  return {
    ...x,
    burnProgressRate: 0,
    burnStartedAt: null,
    burnFinishedAt: null,
    burnFailedAt: null,
    burnError: '',
  }
}
