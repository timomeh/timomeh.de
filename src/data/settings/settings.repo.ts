import { Vla } from 'vla'
import { db, schema } from '@/db/client'
import { contentAssetUrl } from '../cms'

export class SettingsRepo extends Vla.Repo {
  getDefaultKickers = this.memo(async () => {
    const setting = await db.query.settings.findFirst({
      where: (setting, q) => q.eq(setting.key, 'kickers'),
    })

    if (!setting) return []

    const kickers = setting.value as string[]
    return kickers
  })

  getShortsAvatar = this.memo(async () => {
    const setting = await db.query.settings.findFirst({
      where: (setting, q) => q.eq(setting.key, 'shortsAvatar'),
    })

    if (!setting) return 'https://timomeh.de/apple-touch-icon.png'

    const avatar = contentAssetUrl(`/settings/${setting.value as string}`)
    return avatar
  })

  async deleteAll() {
    await db.delete(schema.settings)
  }

  async insertMany(
    settings: { key: 'kickers' | 'shortsAvatar'; value?: unknown }[],
  ) {
    await db.insert(schema.settings).values(settings)
  }
}
