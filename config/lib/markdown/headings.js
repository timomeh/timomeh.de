import slugify from "@sindresorhus/slugify";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

// Give entry subheadings stable, unique fragment links without wrapping existing links.
export function linkSubheadings() {
  return (tree) => {
    const ids = new Set();
    visit(tree, "element", (node) => {
      if (node.properties.id) ids.add(node.properties.id);
    });
    visit(tree, "element", (node) => {
      if (!/^h[2-6]$/.test(node.tagName) || node.properties.id) return;

      const title = toString(node).trim();
      const base = slugify(title) || "section";
      let id = base;
      let suffix = 2;
      while (ids.has(id)) id = `${base}-${suffix++}`;
      ids.add(id);
      node.properties.id = id;
      node.children.push({
        type: "element",
        tagName: "a",
        properties: {
          href: `#${id}`,
          className: ["heading-anchor"],
          ariaLabel: `Link to ${title || "section"}`,
        },
        children: [{ type: "text", value: "#" }],
      });
    });
  };
}
