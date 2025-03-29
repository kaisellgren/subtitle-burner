import { format } from 'date-fns'

export function formatBytes(size: number): string {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

export function formatBitRate(size: number): string {
  const units = ['b', 'kb', 'Mb', 'Gb', 'Tb', 'Pb']
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}ps`
}

export function formatDuration(seconds: number): string {
  const parts = []

  const hours = Math.floor(seconds / 3600)
  if (hours >= 1) {
    parts.push(`${hours}h`)
    seconds -= hours * 3600
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes >= 1) {
    parts.push(`${minutes}min`)
    seconds -= minutes * 60
  }

  if (seconds >= 1) {
    parts.push(`${Math.floor(seconds)}s`)
  }

  return parts.join(' ')
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export function formatTimeRemaining(startedAt: Date, progressRate: number): string {
  if (progressRate <= 0 || progressRate >= 1) {
    return ''
  }

  const delta = new Date().getTime() - startedAt.getTime()
  const timeItTakes = delta / progressRate
  const timeRemaining = timeItTakes - delta

  return formatDuration(timeRemaining / 1000)
}
