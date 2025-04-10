import { contextBridge, ipcRenderer, webUtils } from 'electron'

export interface ElectronApi {
  getFilePath: (file: File) => string
  invoke<T>(channel: string, data: unknown): Promise<T>
  send(channel: string, data: unknown): void
  onCustomEvent<T>(eventName: string, callback: (data: T) => void): void
}

const electronApi: ElectronApi = {
  getFilePath: (file: File) => {
    return webUtils.getPathForFile(file)
  },
  invoke: (channel: string, data: unknown[]) => ipcRenderer.invoke(channel, data),
  send: (channel: string, data: unknown[]) => ipcRenderer.send(channel, data),
  onCustomEvent: (eventName: string, callback) => ipcRenderer.on(eventName, (_event, data) => callback(data)),
}

contextBridge.exposeInMainWorld('electron', electronApi)
