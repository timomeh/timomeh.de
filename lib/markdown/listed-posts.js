import { postUrl } from "../urls.js";

// Overview pages show the full body unless a ReadMore marker truncates it.
// Convert actual post H1s into linked list headings without inventing a title.
export function preparePostPreview(slug) {
  return (tree) => {
    function transformPost(node) {
      if (!node.children) return false;

      for (let index = 0; index < node.children.length; index++) {
        const child = node.children[index];

        // When there's a read more marker, snip of content after it
        if (
          (child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement") &&
          child.name === "ReadMore"
        ) {
          node.children[index] = {
            type: "link",
            url: postUrl(slug),
            data: { hProperties: { className: ["ReadMore"] } },
            children: child.children?.length ? child.children : [text("Read more")],
          };
          node.children.splice(index + 1);
          return true;
        }

        // When there's a h1 heading, make it a h2 heading and link it
        if (child.type === "heading" && child.depth === 1) {
          child.depth = 2;
          child.data ||= {};
          child.data.hProperties = {
            ...child.data.hProperties,
            className: ["PostPreview-title"],
            id: slug,
          };

          // ...only link it when the title is not yet a link
          if (!child.children.some((item) => item.type === "link")) {
            child.children = [
              {
                type: "link",
                url: postUrl(slug),
                data: { hProperties: { className: ["PostPreview-permalink"] } },
                children: child.children,
              },
            ];
          }
        }

        if (transformPost(child)) {
          node.children.splice(index + 1);
          return true;
        }
      }
      return false;
    }

    transformPost(tree);
  };
}

function text(value) {
  return { type: "text", value };
}
