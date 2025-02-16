import { constants } from 'node:fs'
import { promises as fs } from 'node:fs'

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}
