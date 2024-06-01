import { CollectionConfig } from 'payload/types'
import { ColourPickerField } from '@nouance/payload-better-fields-plugin'
import { SlugField } from '@nouance/payload-better-fields-plugin'

export const categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    ...ColourPickerField(
      {
        name: 'color',
        required: true,
      },
      {
        type: 'hex',
      },
    ),
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
        useFields: ['name'],
      },
    ),
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
