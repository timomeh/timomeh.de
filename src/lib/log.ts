import { config } from '@/config'
import pino from 'pino'

const pinoSingleton = () => {
  return pino({
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
    level: config.logLevel,
  })
}

// otherwise there are issues with HMR / fast-refresh
declare const globalThis: {
  pinoSingleton: ReturnType<typeof pinoSingleton>
} & typeof global

export const logger = globalThis.pinoSingleton ?? pinoSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.pinoSingleton = logger
