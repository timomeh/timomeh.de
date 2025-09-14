import { cache } from 'react'

import { db, schema } from '@/db/client'

import { cms, contentAssetUrl } from './cms'

export const getDefaultKickers = cache(async () => {
  const setting = await db.query.settings.findFirst({
    where: (setting, q) => q.eq(setting.key, 'kickers'),
  })

  if (!setting) return []

  const kickers = setting.value as string[]
  return kickers
})

export const getShortsAvatar = cache(async () => {
  const setting = await db.query.settings.findFirst({
    where: (setting, q) => q.eq(setting.key, 'shortsAvatar'),
  })

  if (!setting) return 'https://timomeh.de/apple-touch-icon.png'

  const avatar = contentAssetUrl(`/settings/${setting.value as string}`)
  return avatar
})

export async function updateSettingsCache() {
  const settings = await cms.settings.get()
  if (!settings) return

  await db.delete(schema.settings)

  await db.insert(schema.settings).values([
    { key: 'kickers', value: settings.kickers },
    { key: 'shortsAvatar', value: settings.shortsAvatar },
  ])
}
