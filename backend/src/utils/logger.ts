import winston, { format, createLogger } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const isProd = process.env.NODE_ENV === 'production'
const { combine, timestamp, printf, colorize, errors, json } = format

const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : ''

  return `${timestamp} [${level}]: ${stack || message}${metaString}`
})

const transports: winston.transport[] = []

if (!isProd) {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp(),
        errors({ stack: true }),
        devFormat,
      ),
    }),
  )
}

if (isProd) {
  transports.push(
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),

    new DailyRotateFile({
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
    }),
  )
}

export const logger = createLogger({
  level: isProd ? 'info' : 'debug',

  format: combine(timestamp(), errors({ stack: true }), json()),

  transports,
  exitOnError: false,
})