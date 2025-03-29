export function escapeFfmpegArgument(value: string): string {
  return (
    value
      .replaceAll("'", "\\\\\\'")
      .replaceAll('[', '\\[')
      .replaceAll(']', '\\]')
      .replaceAll('(', '\\(')
      .replaceAll(')', '\\)')
      .replaceAll('"', '\\"')
      .replaceAll('&', '\\&')
      .replaceAll(';', '\\;')
      .replaceAll('$', '\\$')
      .replaceAll('!', '\\!')
      .replaceAll('|', '\\|')
      .replaceAll('>', '\\>')
      .replaceAll('<', '\\<')
  )
}

export function sanitizeFfmpegArgument(value: string): string {
  return value.replaceAll(/'/g, '')
}
