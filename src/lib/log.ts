import { PinoTransport } from '@loglayer/transport-pino'
import { ILogLayer, LogLayer } from 'loglayer'
import pino from 'pino'
import pinoPretty from 'pino-pretty'
import { serializeError } from 'serialize-error'

import { config } from '@/config'

const pinoLogger = pino(
  {
    // for LOG_LEVEL "none", choose another log level.
    // LOG_LEVEL "none" is completely disabled in LogLayer's transport.
    level: config.logLevel === 'none' ? 'fatal' : config.logLevel,
  },
  // Print logs pretty in development
  process.env.NODE_ENV === 'development'
    ? pinoPretty({ colorize: true })
    : undefined,
)

export const log = new LogLayer({
  // don't print logs for LOG_LEVEL "none"
  enabled: config.logLevel !== 'none',
  errorSerializer: serializeError,
  transport: [
    new PinoTransport({
      logger: pinoLogger,
    }),
  ],
})

// Utility to create a logger for a log level. Used to override console methods
// on production.
// Source: https://loglayer.dev/example-integrations/nextjs.html#handling-server-side-uncaught-exceptions-and-rejections
export function createConsoleMethod(
  log: ILogLayer,
  method: 'error' | 'info' | 'warn' | 'debug',
) {
  return (...args: unknown[]) => {
    const data: Record<string, unknown> = {}
    let hasData = false
    let error: Error | null = null
    const messages: string[] = []

    for (const arg of args) {
      if (arg instanceof Error) {
        error = arg
        continue
      }

      if (typeof arg === 'object' && arg !== null) {
        Object.assign(data, arg)
        hasData = true
        continue
      }

      if (typeof arg === 'string') {
        messages.push(arg)
      }
    }

    let finalMessage = stripAnsiCodes(messages.join(' ')).trim()

    // next.js uses an "x" for the error message when it's an error object
    if (finalMessage === '⨯' && error) {
      finalMessage = error?.message || ''
    }

    if (error && hasData && messages.length > 0) {
      log.withError(error).withMetadata(data)[method](finalMessage)
    } else if (error && messages.length > 0) {
      log.withError(error)[method](finalMessage)
    } else if (hasData && messages.length > 0) {
      log.withMetadata(data)[method](finalMessage)
    } else if (error && hasData && messages.length === 0) {
      log.withError(error).withMetadata(data)[method]('')
    } else if (error && messages.length === 0) {
      log.errorOnly(error)
    } else if (hasData && messages.length === 0) {
      log.metadataOnly(data)
    } else {
      log[method](finalMessage)
    }
  }
}

// Strip ANSI codes from a string, which is something Next.js likes to inject.
// Source: https://loglayer.dev/example-integrations/nextjs.html#handling-server-side-uncaught-exceptions-and-rejections
function stripAnsiCodes(str: string): string {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  )
}
