import { findFiles } from './util/file-finder'
import { isSupportedFileType, SUPPORTED_FILE_TYPES } from '../common/video'
import { dirname } from 'node:path'
import { dialog } from 'electron'
import { StateManager } from './state/state-manager'

export class FileService {
  #stateManager: StateManager

  constructor(stateManager: StateManager) {
    this.#stateManager = stateManager
  }

  async findVideoFiles(fullPath: string) {
    return await findFiles(fullPath, SUPPORTED_FILE_TYPES)
  }

  async selectFiles() {
    const result = await dialog.showOpenDialog({
      title: 'Choose files',
      buttonLabel: 'Add files',
      defaultPath: this.#stateManager.state.mainWindow.lastOpenFileDialogPath,
      filters: [
        {
          name: '',
          extensions: SUPPORTED_FILE_TYPES,
        },
      ],
      properties: ['openFile', 'multiSelections'],
    })

    const first = result.filePaths[0]
    if (first) {
      this.#stateManager.state.mainWindow.lastOpenFileDialogPath = dirname(first)
      await this.#stateManager.save()
    }

    return (result.filePaths ?? []).filter(isSupportedFileType)
  }

  async selectDirectories() {
    const result = await dialog.showOpenDialog({
      title: 'Choose folders',
      buttonLabel: 'Add folders',
      defaultPath: this.#stateManager.state.mainWindow.lastOpenDirectoryDialogPath,
      properties: ['openDirectory', 'multiSelections'],
    })

    const first = result.filePaths[0]
    if (first) {
      this.#stateManager.state.mainWindow.lastOpenDirectoryDialogPath = dirname(first)
      await this.#stateManager.save()
    }

    return result.filePaths ?? []
  }
}
