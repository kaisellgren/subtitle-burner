import { State, STATE_DEFAULT } from './state'
import { promises as fs } from 'node:fs'
import { fileExists } from '../util/fs'

const stateFilename = 'state.json'

export class StateManager {
  async read(): Promise<State> {
    if (await fileExists(stateFilename)) {
      try {
        const data = await fs.readFile(stateFilename, 'utf8')
        return {
          ...STATE_DEFAULT,
          ...JSON.parse(data),
        }
      } catch (e) {
        console.error('Could not read state file', e)
      }
    }

    return STATE_DEFAULT
  }

  async write(state: State): Promise<void> {
    await fs.writeFile(stateFilename, JSON.stringify(state, null, 2))
  }
}
