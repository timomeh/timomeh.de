import { CollectionConfig } from 'payload/types'
// import { ColourPickerField } from '@nouance/payload-better-fields-plugin'
// import { SlugField } from '@nouance/payload-better-fields-plugin'
import { revalidateHook } from '../revalidate-hook'

export const categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          void revalidateHook('list:categories', req)
          void revalidateHook(`category:${doc.slug}`, req)
          return
        }

        const prev = await req.payload.findByID({
          collection: 'categories',
          id: doc.id,
        })

        if (doc.slug !== prev.slug) {
          void revalidateHook(`category-post:${doc.slug}`, req)
          void revalidateHook('list:categories', req)
        }

        if (doc.visibility !== prev.visibility) {
          void revalidateHook('list:categories', req)
        }

        void revalidateHook(`category:${doc.slug}`, req)
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        void revalidateHook('list:categories', req)
        void revalidateHook(`category:${doc.slug}`, req)
        void revalidateHook(`category-post:${doc.slug}`, req)
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // ...ColourPickerField(
    //   {
    //     name: 'color',
    //     required: true,
    //   },
    //   {
    //     type: 'hex',
    //   },
    // ),
    // ...SlugField(
    //   {
    //     name: 'slug',
    //     unique: true,
    //     index: true,
    //     required: true,
    //     admin: {
    //       position: 'sidebar',
    //     },
    //   },
    //   {
    //     useFields: ['name'],
    //   },
    // ),
    {
      name: 'visibility',
      type: 'select',
      options: ['public', 'unlisted'],
      hasMany: false,
      required: true,
      defaultValue: 'unlisted',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
