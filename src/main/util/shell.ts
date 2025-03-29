export function sanitizeFilenameForFfmpeg(value: string): string {
  return value.replaceAll(/'/g, '')
}
