import { VideoInfo } from '../common/video-info'
import { proxy } from 'valtio/vanilla'

export interface Store {
  videos: VideoInfo[]
}

export function createStore(): Store {
  return proxy<Store>({
    videos: [],
  })
}
