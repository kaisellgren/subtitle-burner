import { VideoInfo } from '../common/video-info'
import { proxy } from 'valtio/vanilla'
import { Settings } from '../common/settings'

export interface BurnConfig {
  videoId: string
  subtitleId: string | null
}

export interface Store {
  videos: VideoInfo[]
  burnConfigs: BurnConfig[]
  settings: Settings
}

export function createStore(settings: Settings): Store {
  return proxy<Store>({
    videos: [],
    burnConfigs: [],
    settings,
  })
}
