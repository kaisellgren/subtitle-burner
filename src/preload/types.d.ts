declare global {
  interface ElectronApi {
    getFilePath: (file: File) => string;
    invoke<T, R>(channel: string, data: R): Promise<T>
    onCustomEvent<T>(eventName: string, callback: (data: T) => void): void
  }

  interface Window {
    electron: ElectronApi;
  }
}
