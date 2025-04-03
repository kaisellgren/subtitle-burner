import { BrowserWindow } from 'electron'

export async function openLogViewer(text: string): Promise<void> {
  const win = new BrowserWindow({
    width: 1280,
    height: 1024,
    title: 'Logs',
    autoHideMenuBar: true,
    center: true,
  })

  win.webContents.once('did-finish-load', async () => {
    await win.webContents.executeJavaScript(`
      const content = document.getElementById('content');
      window.scrollTo(0, content.scrollHeight);
    `)
  })

  await win.loadURL(`data:text/html;charset=utf-8,<pre id="content">${text}</pre>`)
}
