import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { toError } from '../../common/util/error'

export async function findFiles(fullPath: string, extensions: string[], recursive = true) {
  let results: string[] = []

  try {
    const items = await readdir(fullPath, { withFileTypes: true })

    for (const item of items) {
      const itemPath = path.join(fullPath, item.name)

      if (item.isDirectory() && recursive) {
        const subDirFiles = await findFiles(itemPath, extensions)
        results = results.concat(subDirFiles)
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase().replace('.', '')
        if (extensions.includes(ext)) {
          results.push(itemPath)
        }
      }
    }
  } catch (error) {
    throw new Error('Could not find video files', toError(error))
  }

  return results
}
