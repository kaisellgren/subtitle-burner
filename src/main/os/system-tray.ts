import { app, Menu, Tray } from 'electron'
import { APP_ICON } from './app-icon'

export function createSystemTray() {
  const tray = new Tray(APP_ICON)

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Exit',
        click: () => app.quit(),
      },
    ]),
  )
}
