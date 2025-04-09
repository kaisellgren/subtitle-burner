export const SUPPORTED_FILE_TYPES = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mpg', 'mpeg']

export function isSupportedFileType(file: string): boolean {
  return SUPPORTED_FILE_TYPES.some((extension) => file.endsWith(`.${extension}`))
}
