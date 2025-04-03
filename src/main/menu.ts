import { Menu, shell } from 'electron'
import { readFileSync } from 'fs'
import { openLogViewer } from './util/log-viewer'

export function createMenu() {
  const template: (Electron.MenuItem | Electron.MenuItemConstructorOptions)[] = [
    {
      label: 'File',
      submenu: [{ role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'zoom' }, { role: 'close' }],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'View logs',
          click: async () => {
            const text = (await readFileSync('./subtitle-burner.log')).toString('utf8')
            await openLogViewer(text)
          },
        },
        {
          label: 'Open GitHub page',
          click: async () => {
            await shell.openExternal('https://github.com/kaisellgren/subtitle-burner')
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
}
