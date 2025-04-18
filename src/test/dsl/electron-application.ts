import { _electron as electron } from 'playwright-core'

export async function createElectronApplication() {
  return await electron.launch({
    args: ['dist/main/main.js'],
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  })
}
