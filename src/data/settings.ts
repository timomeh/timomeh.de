import { cache } from 'react'
import { repo } from './db'
import { cms } from './cms'

const SINGLETON_KEY = 'settings'

export const getSettings = cache(async () => {
  const settings = await repo.settings.fetch(SINGLETON_KEY)

  return settings
})

export async function updateSettingsCache() {
  const settings = await cms.settings.get()

  if (!settings) return

  await repo.settings.save(SINGLETON_KEY, settings)
}
