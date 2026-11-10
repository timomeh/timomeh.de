import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

import { renderMdxComponents } from "./components.js";
import { embedMedia } from "./embeds.js";
import { addExternalLinkIcons } from "./links.js";
import { highlightCodeBlocks } from "./shiki.js";
import { renderResponsiveImages } from "./image-pictures.js";
import { enableImageLightbox } from "./image-fancybox.js";
import { optimizeImages } from "./image-optimization.js";
import { markImageThemes, pairThemeImages } from "./image-themes.js";
import { prepareFeedContent } from "./feed-images.js";
import { preparePostPreview } from "./listed-posts.js";
import { renderFootnotes } from "./footnotes.js";

const markdownParser = unified().use(remarkParse).use(remarkGfm).use(remarkMdx).freeze();

export function parseMarkdown(content) {
  return markdownParser.parse(content);
}

async function renderTree(processor, tree, sourceDir) {
  try {
    const rendered = await processor.use(rehypeStringify).run(structuredClone(tree));
    return String(processor.stringify(rendered));
  } catch (error) {
    throw new Error(`Could not render ${sourceDir}: ${error.message}`, { cause: error });
  }
}

export async function renderEntryHtml(tree, { sourceDir, slug }) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(remarkSmartypants)
    .use(renderFootnotes, slug)
    .use(renderMdxComponents)
    .use(markImageThemes)
    .use(embedMedia)
    .use(remarkRehype)
    .use(addExternalLinkIcons)
    .use(highlightCodeBlocks)
    .use(enableImageLightbox, slug)
    .use(optimizeImages, sourceDir)
    .use(pairThemeImages)
    .use(renderResponsiveImages);
  return renderTree(processor, tree, sourceDir);
}

export async function renderPostPreview(tree, { sourceDir, slug }) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(preparePostPreview, slug)
    .use(remarkSmartypants)
    .use(renderFootnotes, slug)
    .use(renderMdxComponents)
    .use(markImageThemes)
    .use(embedMedia)
    .use(remarkRehype)
    .use(addExternalLinkIcons)
    .use(highlightCodeBlocks)
    .use(enableImageLightbox, slug)
    .use(optimizeImages, sourceDir)
    .use(pairThemeImages)
    .use(renderResponsiveImages);
  return renderTree(processor, tree, sourceDir);
}

export async function renderFeedHtml(tree, { sourceDir, slug }) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(remarkSmartypants)
    .use(renderFootnotes, slug)
    .use(renderMdxComponents)
    .use(markImageThemes)
    .use(remarkRehype)
    .use(prepareFeedContent, sourceDir);
  return renderTree(processor, tree, sourceDir);
}

export function extractPlainText(tree) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(remarkSmartypants)
    .use(renderMdxComponents)
    .use(markImageThemes);
  tree = processor.runSync(structuredClone(tree));
  const parts = [];
  visit(tree, (node) => {
    if (["text", "inlineCode", "code"].includes(node.type)) parts.push(node.value);
  });
  return parts.join(" ").replace(/\s+/g, " ").trim();
}
