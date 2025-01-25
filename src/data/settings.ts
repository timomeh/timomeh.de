import { cache } from 'react'

import { logger } from '@/lib/log'

import { cms } from './cms'
import { db, repo } from './db'

const SINGLETON_KEY = 'settings'
const log = logger.child({ module: 'data/settings' })

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
    log.warn(error, 'Error when trying to create the index for settings')
  }
}
