import { constants, promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'
import { readdir } from 'node:fs/promises'

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export function createTempFilename(prefix: string, extension = ''): string {
  return `${tmpdir()}/${prefix}-${randomUUID()}${extension}`
}

export async function listDirectories(path: string) {
  const files = await readdir(path, { withFileTypes: true })
  return files.filter((x) => x.isDirectory())
}
