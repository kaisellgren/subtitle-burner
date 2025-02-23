import { VideoInfo } from '../common/video-info'
import { proxy } from 'valtio/vanilla'

export interface BurnConfig {
  videoId: string
  subtitleId: string | null
}

export interface Store {
  videos: VideoInfo[]
  burnConfigs: BurnConfig[]
}

export function createStore(): Store {
  return proxy<Store>({
    videos: [],
    burnConfigs: [],
  })
}
