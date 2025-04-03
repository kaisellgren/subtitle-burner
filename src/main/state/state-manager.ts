import { State, STATE_DEFAULT } from './state'
import { promises as fs } from 'node:fs'
import { fileExists } from '../util/fs'
import { Logger } from '../util/logger'

const logger = new Logger(import.meta.url)

const stateFilename = 'state.json'

export class StateManager {
  async read(): Promise<State> {
    logger.info('Reading state')

    if (await fileExists(stateFilename)) {
      logger.info('State file found')
      try {
        const data = await fs.readFile(stateFilename, 'utf8')
        const state = {
          ...STATE_DEFAULT,
          ...JSON.parse(data),
        }
        logger.debug(`State loaded: ${JSON.stringify(state)}`)
        return state
      } catch (e) {
        logger.error('Could not read state file', e)
      }
    }

    logger.debug('Using default state')

    return STATE_DEFAULT
  }

  async write(state: State): Promise<void> {
    logger.info(`Updating state: ${JSON.stringify(state)}`)
    try {
      await fs.writeFile(stateFilename, JSON.stringify(state, null, 2))
      logger.info('State updated')
    } catch (error) {
      logger.error('Failed to update state', error)
    }
  }
}
