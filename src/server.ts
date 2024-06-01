import { env } from '@/env'

import next from 'next'
import express from 'express'
import { initPayload } from './payload/client'

const app = express()

async function start() {
  const payload = await initPayload({
    initOptions: {
      express: app,
    },
  })

  const nextApp = next({
    dev: env.NODE_ENV !== 'production',
  })

  let nextHandler: ReturnType<typeof nextApp.getRequestHandler> = async () => {}

  // On prod, first prepare next before starting the server.
  // On dev, prepare next lazily, to start payload quicker.
  if (env.NODE_ENV === 'production') {
    payload.logger.info('Preparing Next.js...')
    await nextApp.prepare()
    nextHandler = nextApp.getRequestHandler()
  }

  app.use((req, res) => nextHandler(req, res))

  app.listen(env.PORT, () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    payload.logger.info(`Next.js App URL:   ${env.PAYLOAD_PUBLIC_SERVER_URL}`)
  })

  if (env.NODE_ENV !== 'production') {
    payload.logger.info('Preparing Next.js...')
    await nextApp.prepare()
    nextHandler = nextApp.getRequestHandler()
  }
}

start()
