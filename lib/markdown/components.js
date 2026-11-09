import { visit } from "unist-util-visit";

export function renderMdxComponents() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (["mdxFlowExpression", "mdxTextExpression", "mdxjsEsm"].includes(node.type)) {
        throw new Error("Unsupported MDX expression or import");
      }

      if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") return;

      const attrs = Object.fromEntries(
        node.attributes
          .filter((attr) => attr.type === "mdxJsxAttribute")
          .map((attr) => [attr.name, attr.value]),
      );
      const children = node.children || [];

      let replacement;
      switch (node.name) {
        case "ReadMore": {
          replacement = { type: "text", value: "" };
          break;
        }

        case "Figure": {
          const shadow =
            attrs.shadow?.type === "mdxJsxAttributeValueExpression"
              ? attrs.shadow.value.trim()
              : attrs.shadow;
          const properties = shadow === "false" ? { "data-shadow": "false" } : {};
          replacement = element(
            "figure",
            [
              ...children,
              ...(typeof attrs.caption === "string"
                ? [element("figcaption", [text(attrs.caption)])]
                : []),
            ],
            properties,
          );
          break;
        }

        case "Aside": {
          replacement = element(
            "aside",
            [
              ...(typeof attrs.title === "string" && attrs.title
                ? [element("header", [text(attrs.title)], { className: ["PostAside-title"] })]
                : []),
              ...children,
            ],
            { className: ["PostAside", "aside"] },
          );
          break;
        }

        case "Lead": {
          replacement = element("div", children, { className: ["lead"] });
          break;
        }

        case "Kbd": {
          replacement = element("kbd", children);
          break;
        }

        case "Footnote": {
          replacement = element("span", [text(" ("), ...children, text(")")], {
            className: ["footnote"],
          });
          break;
        }

        case "DefinitionList": {
          replacement = element("dl", children);
          break;
        }

        case "Definition": {
          replacement = element("div", [
            element("dt", [text(attrs.term || "")]),
            element("dd", children),
          ]);
          break;
        }

        default:
          throw new Error(`Unsupported MDX component <${node.name}>`);
      }
      parent.children[index] = replacement;

      return [visit.CONTINUE, index];
    });
  };
}

function element(name, children = [], properties = {}) {
  return {
    type: "blogElement",
    data: { hName: name, hProperties: properties },
    children,
  };
}

function text(value) {
  return { type: "text", value };
}
