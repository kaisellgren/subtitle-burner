import NodeEnvironment from 'jest-environment-node'
import { createElectronApplication } from './electron-application'

export default class JestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    // @ts-ignore
    this.global.electronApp = await createElectronApplication()
  }
}
