import { cache } from 'react'

import { log as baseLog } from '@/lib/log'
import { captureException } from '@/lib/sentry'

import { cms } from './cms'
import { db, repo } from './db'

const SINGLETON_KEY = 'settings'
const log = baseLog.child().withContext({ module: 'data/settings' })

export const getSettings = cache(async () => {
  await db.connect()

  const settings = await repo.settings.fetch(SINGLETON_KEY)
  return settings
})

export async function updateSettingsCache() {
  await db.connect()

  const settings = await cms.settings.get()
  if (!settings) return

  await repo.settings.save(SINGLETON_KEY, settings)

  try {
    await repo.settings.createIndex()
  } catch (error) {
    captureException(error)
    log
      .withError(error)
      .warn('Error when trying to create the index for settings')
  }
}
