import electron, { app, Menu, Tray } from 'electron'

export function createSystemTray(icon: electron.NativeImage) {
  const tray = new Tray(icon)
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Exit',
        click: () => app.quit(),
      },
    ]),
  )
}
