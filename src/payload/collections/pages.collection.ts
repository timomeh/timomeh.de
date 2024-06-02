import { lexicalHTML } from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload/types'
import { bigBoyEditor } from '../fields/bigBoyEditor'
import { SlugField } from '@nouance/payload-better-fields-plugin'
import { revalidateHook } from '../revalidate-hook'

export const pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status === 'draft') return

        const prev = await req.payload.findByID({
          collection: 'pages',
          id: doc.id,
        })

        if (doc.slug !== prev.slug || doc._status !== prev._status) {
          void revalidateHook('list:pages', req)
        }

        void revalidateHook(`page:${doc.slug}`, req)
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        void revalidateHook('list:pages', req)
        void revalidateHook(`page:${doc.slug}`, req)
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
              editor: bigBoyEditor(),
            },
            lexicalHTML('body', { name: 'body_html' }),
          ],
        },
        {
          label: 'Frontmatter',
          fields: [
            {
              name: 'excerpt',
              type: 'richText',
              editor: bigBoyEditor(),
            },
            lexicalHTML('excerpt', { name: 'excerpt_html' }),
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: {
                description: 'falls back to the excerpt or body',
              },
            },
            {
              name: 'metaKeywords',
              type: 'text',
              admin: {
                description: 'comma separated',
              },
            },
            {
              name: 'lang',
              type: 'text',
              label: 'Locale (ISO)',
            },
            {
              name: 'ogImage',
              label: 'Open Graph Image',
              type: 'upload',
              relationTo: 'uploads',
              filterOptions: {
                mimeType: { contains: 'image' },
              },
              admin: {
                description: '1200x630 would be nice',
              },
            },
          ],
        },
      ],
    },

    ...SlugField(
      {
        name: 'slug',
        unique: true,
        index: true,
        required: true,
        admin: {
          position: 'sidebar',
        },
      },
      {
        useFields: ['title'],
      },
    ),

    {
      name: 'visibility',
      type: 'select',
      options: ['public', 'unlisted', 'private'],
      hasMany: false,
      required: true,
      defaultValue: 'public',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
  timestamps: true,
}
