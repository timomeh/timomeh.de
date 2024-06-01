import { lexicalHTML } from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload/types'
import { bigBoyEditor } from '../fields/bigBoyEditor'
import { SlugField } from '@nouance/payload-better-fields-plugin'

export const pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
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
          label: 'Meta',
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
          label: 'SEO',
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
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
  timestamps: true,
}
