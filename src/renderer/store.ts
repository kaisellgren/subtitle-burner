import { proxy } from 'valtio/vanilla'
import { Settings } from '../common/settings'
import { Video } from './video/video'

export interface BurnConfig {
  videoId: string
  subtitleId: string | null
}

export interface Store {
  videos: Video[]
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
