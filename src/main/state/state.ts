import { Rectangle } from 'electron'

export interface State {
  mainWindow: {
    bounds: Rectangle
  }
}

export const STATE_DEFAULT: State = {
  mainWindow: {
    bounds: {
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    },
  }
}
