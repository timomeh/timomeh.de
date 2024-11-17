import { visit } from 'unist-util-visit'
import { Root } from 'mdast'

// If an image is a relative path, adds the baseUrl to it.

export function remarkImageSrcPrefix({ baseUrl = '' }) {
  return function transformer(tree: Root) {
    visit(tree, 'image', (node) => {
      try {
        // Try to construct a URL. If it fails, `node.url` is not an absolute URL.
        new URL(node.url)
      } catch {
        // Prefix the URL since it's relative
        node.url = `${baseUrl}${node.url}`
      }
    })
  }
}
