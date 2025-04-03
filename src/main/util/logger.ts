import { appendFileSync } from 'node:fs'
import { basename } from 'node:path'
import chalk from 'chalk'

type Level = 'DEBUG' | 'INFO' | 'ERROR'

export class Logger {
  #name: string

  constructor(name: string) {
    this.#name = basename(name).replace(/\.\w+$/, '')
  }

  debug(message: string): void {
    this.#log('DEBUG', message)
  }

  info(message: string): void {
    this.#log('INFO', message)
  }

  error(message: string, error: Error | unknown): void {
    this.#log(
      'ERROR',
      `${message}
${error}
`,
    )
  }

  #log(level: Level, rawMessage: string): void {
    const date = new Date()

    const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
    const namePart = `[${this.#name}]`
    const stdoutFirstPart = `${chalk.cyan(timePart)} ${chalk.magenta(namePart)}`

    switch (level) {
      case 'DEBUG':
        console.log(`${stdoutFirstPart} ${chalk.grey(rawMessage)}`)
        appendFileSync('./subtitle-burner.log', `${timePart} DEBUG ${namePart} ${rawMessage}\n`)
        break
      case 'INFO':
        console.log(`${stdoutFirstPart} ${rawMessage}`)
        appendFileSync('./subtitle-burner.log', `${timePart} INFO  ${namePart} ${rawMessage}\n`)
        break
      case 'ERROR':
        console.log(`${stdoutFirstPart} ${chalk.red(rawMessage)}`)
        appendFileSync('./subtitle-burner.log', `${timePart} ERROR ${namePart} ${rawMessage}\n`)
        break
    }
  }
}

function pad(value: number, amount = 2): string {
  return String(value).padStart(amount, '0')
}
