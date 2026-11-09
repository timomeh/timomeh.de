import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
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

export async function renderEntryHtml(content, { sourceDir, slug }) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
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
  try {
    return String(await processor.use(rehypeStringify).process(content));
  } catch (error) {
    throw new Error(`Could not render ${sourceDir}: ${error.message}`, { cause: error });
  }
}

export async function renderPostPreview(content, { sourceDir, slug }) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(preparePostPreview, slug)
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
  try {
    return String(await processor.use(rehypeStringify).process(content));
  } catch (error) {
    throw new Error(`Could not render ${sourceDir}: ${error.message}`, { cause: error });
  }
}

export async function renderFeedHtml(content, { sourceDir }) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(renderMdxComponents)
    .use(markImageThemes)
    .use(remarkRehype)
    .use(prepareFeedContent, sourceDir);
  try {
    return String(await processor.use(rehypeStringify).process(content));
  } catch (error) {
    throw new Error(`Could not render ${sourceDir}: ${error.message}`, { cause: error });
  }
}

export function extractPlainText(content) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(renderMdxComponents)
    .use(markImageThemes);
  const tree = processor.runSync(processor.parse(content));
  const parts = [];
  visit(tree, (node) => {
    if (["text", "inlineCode", "code"].includes(node.type)) parts.push(node.value);
  });
  return parts.join(" ").replace(/\s+/g, " ").trim();
}
