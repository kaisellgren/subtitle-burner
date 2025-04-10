import { findFiles } from './util/file-finder'
import { SUPPORTED_FILE_TYPES } from '../common/video'

export class FileService {
  async findVideoFiles(fullPath: string) {
    return await findFiles(fullPath, SUPPORTED_FILE_TYPES)
  }
}
