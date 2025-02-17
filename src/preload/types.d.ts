declare global {
  interface ElectronApi {
    getFilePath: (file: File) => string;
    invoke<T>(channel: string, data: T): Promise<T>
  }

  interface Window {
    electron: ElectronApi;
  }
}
