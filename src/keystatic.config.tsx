import { collection, config, fields, singleton } from '@keystatic/core'
import {
  inline,
  mark,
  repeating,
  wrapper,
} from '@keystatic/core/content-components'
import {
  BetweenHorizonalStart,
  BookOpen,
  BookOpenText,
  Footprints,
  Images,
  Keyboard,
  MessageSquareText,
  ScrollText,
} from 'lucide-react'

const components = {
  ReadMore: inline({
    label: 'Read more',
    icon: <BetweenHorizonalStart />,
    ContentView: () => <> Read more ... </>,
    schema: {},
  }),
  Footnote: mark({
    label: 'Footnote',
    icon: <Footprints />,
    className:
      'text-gray-500 before:content-["_(Footnote:_"] after:content-[")"] underline decoration-dashed decoration-gray-300',
    schema: {},
  }),
  Kbd: mark({
    label: '<kbd>',
    icon: <Keyboard />,
    className: 'border rounded-md border-gray-500 border-b-2 px-1 bg-gray-100',
    schema: {},
  }),
  Lead: wrapper({
    label: 'Lead',
    icon: <ScrollText />,
    schema: {},
  }),
  Figure: wrapper({
    label: 'Figure',
    icon: <Images />,
    ContentView: (props) => {
      return (
        <>
          {props.children}
          <div className="mt-2 text-sm leading-tight text-gray-600 italic">
            {props.value.caption}
          </div>
        </>
      )
    },
    schema: {
      caption: fields.text({
        label: 'Caption',
        multiline: true,
      }),
      shadow: fields.checkbox({
        label: 'Shadow',
        defaultValue: true,
      }),
    },
  }),
  Aside: wrapper({
    label: 'Aside',
    icon: <MessageSquareText />,
    ContentView: (props) => {
      return (
        <>
          <div className="bold text-sm leading-tight text-gray-600">
            {props.value.title}
          </div>
          {props.children}
        </>
      )
    },
    schema: {
      title: fields.text({
        label: 'Title',
        multiline: false,
      }),
    },
  }),
  DefinitionList: repeating({
    label: 'Definition List',
    children: ['Definition'],
    icon: <BookOpen />,
    schema: {},
  }),
  Definition: wrapper({
    label: 'Definition',
    icon: <BookOpenText />,
    ContentView: (props) => {
      return (
        <>
          <strong className="mb-1 block">{props.value.term}</strong>
          {props.children}
        </>
      )
    },
    schema: {
      term: fields.text({ label: 'Term', validation: { isRequired: true } }),
    },
  }),
}

export default config({
  storage: {
    kind: 'github',
    repo: 'timomeh/timomeh.de-content',
  },
  ui: {
    brand: {
      name: 'timomeh.de',
      // biome-ignore lint/performance/noImgElement: keystatic
      mark: () => <img alt="" src="/favicon-32x32.png" height={24} />,
    },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      entryLayout: 'content',
      path: 'posts/*/',
      format: { contentField: 'content' },
      columns: ['title', 'status', 'publishedAt'],
      schema: {
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Unlisted', value: 'unlisted' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'published',
        }),
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true },
          },
        }),
        content: fields.mdx({
          label: 'Content',
          components,
          options: {
            image: {
              directory: 'posts',
            },
          },
        }),
        publishedAt: fields.datetime({
          label: 'Published at',
          defaultValue: { kind: 'now' },
          validation: { isRequired: true },
        }),
        updatedAt: fields.datetime({
          label: 'Updated at',
        }),
        tags: fields.array(
          fields.relationship({
            label: 'Tags',
            collection: 'tags',
            validation: { isRequired: true },
          }),
          {
            itemLabel: (props) => props.value || 'NULL',
            label: 'Tags',
          },
        ),

        frontmatter: fields.object(
          {
            cover: fields.ignored(),
            lightCover: fields.image({
              label: 'Cover Image',
              directory: 'posts',
            }),
            lightBgColor: fields.text({
              label: 'Background Color',
              description: 'tinted background of the post',
            }),
            darkCover: fields.image({
              label: 'Dark Cover Image',
              directory: 'posts',
            }),
            darkBgColor: fields.text({
              label: 'Dark Background Color',
              description: 'tinted background of the post',
            }),
            readingTime: fields.text({
              label: 'Reading time',
              description: 'Number will show as minutes. Text allowed.',
            }),
            kicker: fields.text({
              label: 'Kicker',
              description: 'smol text above header name',
            }),
          },
          { label: 'Frontmatter' },
        ),

        meta: fields.object(
          {
            description: fields.text({ label: 'Description', multiline: true }),
            image: fields.image({
              label: 'Open Graph Image',
              description: 'Will override the autogenerated image (1200x630)',
              directory: 'posts',
            }),
            lang: fields.text({
              label: 'Language',
              defaultValue: 'en_US',
            }),
          },
          { label: 'Meta' },
        ),
      },
    }),

    tags: collection({
      label: 'Tags',
      slugField: 'title',
      entryLayout: 'form',
      path: 'tags/*/',
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true },
          },
        }),
        color: fields.text({
          label: 'Color',
          validation: { isRequired: true },
        }),
        frontmatter: fields.object(
          {
            kicker: fields.text({
              label: 'Kicker',
              description: 'smol text above header name',
            }),
          },
          { label: 'Frontmatter' },
        ),
        meta: fields.object(
          {
            description: fields.text({ label: 'Description', multiline: true }),
            image: fields.image({
              label: 'Open Graph Image',
              description: 'Will override the autogenerated image (1200x630)',
              directory: 'tags',
            }),
          },
          { label: 'Meta' },
        ),
      },
    }),

    pages: collection({
      label: 'Pages',
      slugField: 'title',
      entryLayout: 'content',
      path: 'pages/*/',
      format: { contentField: 'content' },
      columns: ['title', 'path'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true },
          },
        }),
        path: fields.text({
          label: 'URL Path',
          // see https://github.com/vercel/next.js/issues/57349
          // og images can't deal with dynamic catch-all segments
          description: 'unimplemented!',
          validation: { isRequired: true },
        }),
        visibility: fields.select({
          label: 'Visibility',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Private', value: 'private' },
          ],
          defaultValue: 'public',
        }),
        content: fields.mdx({
          label: 'Content',
          components,
          options: {
            image: {
              directory: 'pages',
            },
          },
        }),

        frontmatter: fields.object(
          {
            kicker: fields.text({
              label: 'Kicker',
              description: 'smol text above header name',
            }),
          },
          { label: 'Frontmatter' },
        ),

        meta: fields.object(
          {
            description: fields.text({ label: 'Description', multiline: true }),
            image: fields.image({
              label: 'Open Graph Image',
              description: 'Will override the autogenerated image (1200x630)',
              directory: 'pages',
            }),
            lang: fields.text({
              label: 'Language',
              defaultValue: 'en_US',
            }),
          },
          { label: 'Meta' },
        ),
      },
    }),
  },

  singletons: {
    settings: singleton({
      label: 'Settings',
      schema: {
        tags: fields.array(
          fields.relationship({
            label: 'Navigation Tags',
            collection: 'tags',
            validation: { isRequired: true },
          }),
          {
            itemLabel: (props) => props.value || 'NULL',
            label: 'Tags',
          },
        ),
        kickers: fields.array(
          fields.text({
            label: 'Random Kicker',
            description: 'usually "a head full of [...] by"',
            validation: { isRequired: true },
          }),
          {
            itemLabel: (props) => props.value || 'NULL',
            label: 'Fallback Kickers',
          },
        ),
      },
    }),
  },
})
