import { cache } from 'react'
import { db, repo } from './db'
import { cms } from './cms'

const SINGLETON_KEY = 'SETTINGS'

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
    console.warn('error when recreating index', error)
  }
}
