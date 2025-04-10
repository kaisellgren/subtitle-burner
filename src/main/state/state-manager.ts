import { State, STATE_DEFAULT } from './state'
import { promises as fs } from 'node:fs'
import { fileExists } from '../util/fs'
import { Logger } from '../util/logger'
import { expectNotNull } from '../../common/objects'

const logger = new Logger(import.meta.url)

const stateFilename = 'state.json'

export class StateManager {
  #state?: State

  get state(): State {
    return expectNotNull(this.#state, 'Expected state to be initialized')
  }

  async init(): Promise<void> {
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
        this.#state = state
        return
      } catch (e) {
        logger.error('Could not read state file', e)
      }
    }

    logger.debug('Using default state')

    this.#state = STATE_DEFAULT
  }

  async save(): Promise<void> {
    logger.info(`Updating state: ${JSON.stringify(this.state)}`)
    try {
      await fs.writeFile(stateFilename, JSON.stringify(this.state, null, 2))
      logger.info('State updated')
    } catch (error) {
      logger.error('Failed to update state', error)
    }
  }
}
