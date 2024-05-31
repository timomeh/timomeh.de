import { loadEnvConfig } from '@next/env'
import next from 'next'

import express from 'express'
import payload from 'payload'

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production')

const app = express()
const PORT = process.env.PORT || 3000

async function start() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || '',
    express: app,
  })

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
  })

  const nextHandler = nextApp.getRequestHandler()

  app.use((req, res) => nextHandler(req, res))

  payload.logger.info('Preparing Next.js...')
  await nextApp.prepare()

  app.listen(PORT, () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    payload.logger.info(
      `Next.js App URL:   ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`,
    )
  })
}

start()
