import { VideoInfo } from '../../common/video-info'

export interface Video extends VideoInfo {
  burnProgressRate: number
  burnStartedAt: Date | null
  burnFinishedAt: Date | null
}

export function toVideo(x: VideoInfo): Video {
  return {
    ...x,
    burnProgressRate: 0,
    burnStartedAt: null,
    burnFinishedAt: null,
  }
}
