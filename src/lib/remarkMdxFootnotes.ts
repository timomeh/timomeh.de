// Inspired by:
// https://github.com/stefanprobst/keystatic-footnotes/blob/main/lib/footnotes.js

import type { Root } from 'mdast'
import type {
  MdxJsxAttribute,
  MdxJsxFlowElement,
  MdxJsxTextElement,
} from 'mdast-util-mdx'
import { SKIP, visit } from 'unist-util-visit'

// This chonker will turn all inline MDX `<Footnote />` components into multiple
// components, which makes it easier to render them.
// - <FootnoteReference /> is the small number that references a footnote
// - <FootnoteContent /> is the content of a footnote
// - <FootnoteSection /> is a section of FootnoteContent's, that's put before the
//   next headline, or at the end of the page.

export function withMdxFootnotes() {
  return function transformer(tree: Root) {
    let count = 1

    let footnotes: MdxJsxTextElement[] = []

    visit(tree, (node, index, parent) => {
      if (node.type === 'mdxJsxTextElement' && node.name === 'Footnote') {
        const countAttribute: MdxJsxAttribute = {
          type: 'mdxJsxAttribute',
          name: 'count',
          value: String(count),
        }

        const reference: MdxJsxTextElement = {
          type: 'mdxJsxTextElement',
          name: 'FootnoteReference',
          attributes: [countAttribute],
          children: [],
        }

        const content: MdxJsxTextElement = {
          type: 'mdxJsxTextElement',
          name: 'FootnoteContent',
          attributes: [countAttribute],
          children: node.children,
        }

        // @ts-expect-error Parent node exists.
        parent.children.splice(index, 1, reference)
        footnotes.push(content)

        count++
        return SKIP
      }

      if (node.type === 'heading' && footnotes.length > 0) {
        const section: MdxJsxFlowElement = {
          type: 'mdxJsxFlowElement',
          name: 'FootnotesSection',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'startCount',
              value: String(count - footnotes.length),
            },
          ],
          // @ts-expect-error Should be fine to set `MdxJsxTextElement` children.
          children: footnotes,
        }

        // Insert the footnotes section before the heading
        // @ts-expect-error Parent node exists.
        parent.children.splice(index, 0, section)
        footnotes = [] // Reset for the next section
      }
    })

    if (footnotes.length > 0) {
      const section: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: 'FootnotesSection',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'startCount',
            value: String(count - footnotes.length),
          },
        ],
        // @ts-expect-error Should be fine to set `MdxJsxTextElement` children.
        children: footnotes,
      }

      tree.children.push(section)
    }
  }
}
