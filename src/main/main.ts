import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import path from 'node:path'
import icon64 from './icon/icon-64x64.png'

await app.whenReady()

const icon = nativeImage.createFromPath(path.join(__dirname, icon64 as string))

const win = new BrowserWindow({
  width: 1280,
  height: 1280,
  webPreferences: {
    preload: path.join(__dirname, '../preload/preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
  },
  icon,
})

win.setProgressBar(0.45, {
  mode: 'normal',
})

if (process.platform === 'linux' && app.dock != null) {
  app.dock.setIcon(icon)
}

const tray = new Tray(icon)
tray.setContextMenu(
  Menu.buildFromTemplate([
    {
      label: 'Exit',
      click: () => app.quit(),
    },
  ]),
)

if (process.env.NODE_ENV === 'development') {
  void win.loadURL('http://localhost:5173')
} else {
  void win.loadFile(path.join(__dirname, '../renderer/index.html'))
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
