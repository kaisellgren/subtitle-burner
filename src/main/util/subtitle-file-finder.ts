import { findFiles } from './file-finder'
import path, { dirname } from 'node:path'
import { listDirectories } from './fs'
import { SUPPORTED_FILE_TYPES } from '../../common/video'
import { Subtitle } from '../../common/video-info'
import { LANGUAGE_CODES } from '../../common/language-codes'

export async function findSubtitleFilesForVideo(fullPath: string): Promise<Subtitle[]> {
  const baseDirectory = dirname(fullPath)

  const subtitleFiles = await findFiles(baseDirectory, ['srt', 'sub'], false)

  const subDirectories = await listDirectories(baseDirectory)
  for (const subDirectory of subDirectories) {
    const subDirPath = path.join(subDirectory.parentPath, subDirectory.name)
    const videoFiles = await findFiles(subDirPath, SUPPORTED_FILE_TYPES, false)

    if (videoFiles.length == 0) {
      const subDirSubtitleFiles = await findFiles(subDirPath, ['srt', 'sub'], false)
      subtitleFiles.push(...subDirSubtitleFiles)
    }
  }

  return subtitleFiles.map((x): Subtitle => {
    return {
      id: x,
      fullPath: x,
      language: determineLanguageCodeFromFilename(x),
      title: x.replace(dirname(fullPath), '').slice(1),
    }
  })
}

function determineLanguageCodeFromFilename(x: string): string {
  for (const [code, name] of Object.entries(LANGUAGE_CODES)) {
    if (x.toLowerCase().includes(name.toLowerCase())) {
      return code
    }
  }

  for (const code of Object.keys(LANGUAGE_CODES)) {
    if (x.toLowerCase().includes(code.toLowerCase())) {
      return code
    }
  }

  return '?'
}
