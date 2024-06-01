import { env } from '@/env'
import { CollectionConfig } from 'payload/types'

export const uploads: CollectionConfig = {
  slug: 'uploads',
  admin: {
    group: 'System',
  },
  access: {
    // uploads have public URLs
    read: () => true,
  },
  upload: {
    staticURL: env.PAYLOAD_UPLOADS_URL,
    staticDir: env.PAYLOAD_UPLOADS_DIR,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  timestamps: true,
}
