import { Rectangle } from 'electron'
import { Settings } from '../../common/settings'

export interface State {
  mainWindow: {
    bounds: Rectangle
    lastOpenFileDialogPath?: string
    lastOpenDirectoryDialogPath?: string
  }
  settings: Settings
}

export const STATE_DEFAULT: State = {
  mainWindow: {
    bounds: {
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    },
  },
  settings: {
    preferredLanguages: [],
  },
}
