import { bundledLanguages, createHighlighter } from "shiki";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderWhitespace,
} from "@shikijs/transformers";
import { visit } from "unist-util-visit";

export function highlightCodeBlocks() {
  return async (tree) => {
    const blocks = [];
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;
      const code = node.children.find(
        (child) => child.type === "element" && child.tagName === "code",
      );
      if (!code) return;
      const lang =
        (code.properties.className || []).find((name) => name.startsWith("language-"))?.slice(9) ||
        "text";
      const source = code.children
        .map((child) => (child.type === "text" ? child.value : ""))
        .join("");
      blocks.push({ parent, index, lang, source });
    });

    await Promise.all(
      blocks.map(async ({ parent, index, lang, source }) => {
        const grammar = await loadLanguage(lang);
        const instance = await highlighter;
        const highlighted = instance.codeToHast(source, {
          lang: grammar,
          themes: { light: "one-light", dark: "tokyo-night" },
          transformers,
        });
        const children = highlighted.children;
        if (!hiddenLabels.has(lang)) {
          children.push({
            type: "element",
            tagName: "span",
            properties: {
              className: ["CodeBlock-lang"],
              "data-language": lang,
              "aria-hidden": "true",
            },
            children: [{ type: "text", value: lang }],
          });
        }
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: { className: ["CodeBlock"] },
          children,
        };
      }),
    );
  };
}

// Reuse the highlighter and only load grammars that the content actually uses.
const highlighter = createHighlighter({ themes: ["one-light", "tokyo-night"], langs: [] });
const languageLoads = new Map();
const transformers = [
  transformerNotationDiff({ matchAlgorithm: "v3" }),
  transformerNotationHighlight({ matchAlgorithm: "v3" }),
  transformerNotationWordHighlight({ matchAlgorithm: "v3" }),
  transformerNotationFocus({ matchAlgorithm: "v3" }),
  transformerNotationErrorLevel({ matchAlgorithm: "v3" }),
  transformerRenderWhitespace({ position: "boundary" }),
];
const hiddenLabels = new Set([
  "text",
  "txt",
  "plain",
  "sh",
  "git-commit",
  "git-rebase",
  "console",
  "bash",
  "shellscript",
  "zsh",
  "shellsession",
  "log",
]);

async function loadLanguage(lang) {
  if (
    !lang ||
    ["plain", "text", "txt", "log"].includes(lang) ||
    !Object.hasOwn(bundledLanguages, lang)
  )
    return "text";
  if (!languageLoads.has(lang)) {
    languageLoads.set(
      lang,
      highlighter.then((instance) => instance.loadLanguage(lang)),
    );
  }
  await languageLoads.get(lang);
  return lang;
}
