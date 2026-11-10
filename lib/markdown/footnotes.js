import { visit } from "unist-util-visit";

// Collect inline notes up to the next heading, while numbering across the entry.
export function renderFootnotes(slug = "entry") {
  return (tree) => {
    let count = 0;
    let notes = [];
    const scope = encodeURIComponent(slug);

    function flush() {
      if (!notes.length) return null;
      const start = count - notes.length + 1;
      const section = element("section", [element("ol", notes, { start })], {
        className: ["footnotes"],
        "aria-label": "Footnotes",
      });
      notes = [];
      return section;
    }

    const blocks = [];
    for (const block of tree.children) {
      if (block.type === "heading") {
        const section = flush();
        if (section) blocks.push(section);
      }

      visit(block, "mdxJsxTextElement", (node, index, parent) => {
        if (node.name !== "Footnote" || !parent) return;
        const number = ++count;
        const refId = `fn-ref-${scope}-${number}`;
        const noteId = `fn-${scope}-${number}`;
        parent.children[index] = element("sup", [
          element("a", [text(`[${number}]`)], {
            href: `#${noteId}`,
            "aria-label": `Footnote [${number}]`,
          }),
        ], { id: refId, className: ["footnote-ref"] });
        notes.push(element("li", [
          ...node.children,
          text(" "),
          element("a", [text("↑")], {
            href: `#${refId}`,
            "aria-label": `Back to reference ${number}`,
          }),
        ], { id: noteId }));
        return visit.SKIP;
      });
      blocks.push(block);
    }
    const section = flush();
    if (section) blocks.push(section);
    tree.children = blocks;
  };
}

function element(name, children, properties = {}) {
  return { type: "blogElement", data: { hName: name, hProperties: properties }, children };
}

function text(value) {
  return { type: "text", value };
}
