import { lexicalHTML } from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload/types'
import { bigBoyEditor } from '../fields/bigBoyEditor'
import { SlugField } from '@nouance/payload-better-fields-plugin'

export const posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'visibility'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Article',
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
              type: 'row',
              fields: [
                {
                  name: 'lang',
                  type: 'text',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'readingTime',
                  label: 'Reading Time Override',
                  type: 'text',
                  admin: {
                    width: '25%',
                  },
                },
              ],
            },
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
      defaultValue: 'unlisted',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'uploads',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
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
