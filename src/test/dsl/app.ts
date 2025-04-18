import { ElectronApplication } from 'playwright'

export class App {
  async getAppPath() {
    return await this.electronApp.evaluate(async ({ app }) => app.getAppPath())
  }

  async close() {
    await this.electronApp.close()
  }

  async title() {
    const window = await this.electronApp.firstWindow()
    return await window.title()
  }

  get electronApp() {
    // @ts-ignore
    return global.electronApp as unknown as ElectronApplication
  }
}

export const app = new App()
