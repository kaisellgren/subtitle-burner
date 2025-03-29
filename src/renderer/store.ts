import { proxy } from 'valtio/vanilla'
import { Settings } from '../common/settings'
import { Video } from './video/video'

export interface Store {
  videos: Video[]
  settings: Settings
}

export function createStore(settings: Settings): Store {
  return proxy<Store>({
    videos: [],
    settings,
  })
}
