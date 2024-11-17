import { visit } from 'unist-util-visit'
import { Root } from 'mdast'

// This boy will yeet everything after `<ReadMore />`.

export function remarkReadMore() {
  return function transformer(tree: Root) {
    let readMoreFound = false

    visit(tree, (node, index, parent) => {
      if (readMoreFound && parent) {
        // If <ReadMore /> has been found, remove subsequent nodes in the same parent container
        parent.children = parent.children.slice(0, index)
        return // Stop further traversal
      }

      // Detect <ReadMore /> as an inline JSX element
      if (node.type === 'mdxJsxTextElement' && node.name === 'ReadMore') {
        readMoreFound = true
      }
    })

    visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
      if (node.name === 'ReadMore') {
        // Mark that ReadMore was found
        readMoreFound = true

        // Remove everything after this node
        if (parent && typeof index === 'number') {
          parent.children = parent.children.slice(0, index + 1)
        }
      }
    })
  }
}
