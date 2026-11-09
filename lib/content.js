import path from "node:path";
import { readFile, readdir } from "node:fs/promises";
import matter from "gray-matter";
import YAML from "yaml";

import {
  renderEntryHtml,
  renderPostPreview,
  renderFeedHtml,
  extractPlainText,
} from "./markdown/render.js";
import { imageoptim } from "./imageoptim.js";
import { contentDir } from "./constants.js";
import { pageUrl, postUrl, shortUrl } from "./urls.js";
import { readingTime } from "./reading-time.js";
import { generateOgImage } from "./og-image.js";

export async function loadContent() {
  const [posts, pages, shorts, settings] = await Promise.all([
    readEntries("posts"),
    readEntries("pages"),
    readEntries("shorts"),
    readSettings(),
  ]);

  const categories = await readCategories(posts);
  const years = buildYears(posts);
  const timeline = buildTimeline(posts, shorts);

  return {
    posts,
    pages,
    shorts,
    categories,
    years,
    timeline,
    kickers: (settings.kickers || []).filter(Boolean),
  };
}

async function readCategories(posts) {
  const tagDirs = await readdir(path.join(contentDir, "tags"), { withFileTypes: true });

  let categories = await Promise.all(
    tagDirs.map(async (dir) => {
      if (!dir.isDirectory()) return skipped(dir.name, "not a directory");

      const data = YAML.parse(
        await readFile(path.join(contentDir, "tags", dir.name, "index.yaml"), "utf8"),
      );
      const slug = dir.name;

      return {
        ...data,
        slug,
        url: `/categories/${slug}/`,
        posts: posts.filter((post) => post.tags?.includes(slug)),
      };
    }),
  );

  categories = categories.filter(Boolean);
  categories = categories.sort((a, b) => a.title.localeCompare(b.title));
  return categories;
}

async function readSettings() {
  const file = await readFile(path.join(contentDir, "settings", "index.yaml"), "utf8");
  const settings = YAML.parse(file) || {};
  return settings;
}

async function readEntries(kind) {
  const entriesDir = path.join(contentDir, kind);
  const dirs = await readdir(entriesDir, { withFileTypes: true });

  let entries = await Promise.all(
    dirs.map(async (dir) => {
      if (!dir.isDirectory()) return skipped(dir.name, "not a directory");
      const filepath = path.join(entriesDir, dir.name, "index.mdx");
      const slug = dir.name;

      const raw = await readFile(filepath, "utf8").catch((error) => {
        if (error.code === "ENOENT") return null;
        throw error;
      });
      if (!raw) return skipped(slug, "no such file or directory");

      const { data, content } = matter(raw);

      if (kind === "posts" && data.status !== "published")
        return skipped(slug, "not a published post");
      if (kind === "pages" && data.visibility !== "public")
        return skipped(slug, "not a public page");

      const sourceDir = path.dirname(filepath);
      let url;
      if (kind === "posts") url = postUrl(slug);
      if (kind === "shorts") url = shortUrl(slug);
      if (kind === "pages") url = pageUrl(data.path, slug);

      const renderOptions = { sourceDir, slug };
      const html = await renderEntryHtml(content, renderOptions);

      let feedHtml = "";
      if (kind !== "pages") feedHtml = await renderFeedHtml(content, { sourceDir });

      let excerptHtml = "";
      if (kind === "posts") excerptHtml = await renderPostPreview(content, renderOptions);

      const frontmatter = data.frontmatter || {};

      // Optimize short images.
      // Images in posts etc are embedded into the content, and are optimized
      // during mdx rendering. But short images are attachments, so we need to
      // optimize them separately.
      const attachments = await Promise.all(
        (data.attachments || []).map(async (attachment) => ({
          ...attachment,
          image: await imageoptim(attachment.attachment, sourceDir),
        })),
      );

      const entry = {
        ...data,
        slug,
        url,
        html,
        feedHtml,
        excerptHtml,
        relatedPostSlugs: data.relatedPosts || [],
        cover: {
          light: frontmatter.lightCover,
          dark: frontmatter.darkCover,
          lightImage: frontmatter.lightCover
            ? await imageoptim(frontmatter.lightCover, sourceDir)
            : null,
          darkImage: frontmatter.darkCover
            ? await imageoptim(frontmatter.darkCover, sourceDir)
            : null,
          lightColor: frontmatter.lightBgColor,
          darkColor: frontmatter.darkBgColor,
        },
        attachments,
        readingTime: readingTime(content, frontmatter.readingTime),
        plainText: kind === "shorts" ? extractPlainText(content) : undefined,
      };
      entry.ogImage = await generateOgImage(entry, sourceDir, kind);
      return entry;
    }),
  );

  entries = entries.filter(Boolean);
  entries = entries.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

  if (kind === "posts") {
    entries = entries.map(entry => {
      let relatedPosts = entry.relatedPostSlugs.map(slug => {
        return entries.find(e => e.slug === slug)
      })
      relatedPosts = relatedPosts.filter(Boolean)

      return {
        ...entry,
        relatedPosts
      }
    })
  }

  return entries;
}

/**
 * Builds a timeline of posts grouped by year:
 * [
 *  { year: 2026, posts: [post, post, ...] },
 *  { year: 2025, posts: [post, post, ...] },
 *  ...
 * ]
 */
function buildYears(posts) {
  const years = [];
  for (const post of posts) {
    const year = new Date(post.publishedAt).getUTCFullYear();
    let group = years.find((item) => item.year === year);
    if (!group) years.push((group = { year, posts: [] }));
    group.posts.push(post);
  }

  return years;
}

/**
 * Builds the home timeline of posts and shorts in a chronologic order.
 * Consecutive shorts are grouped:
 * [
 *  { type: "post", entry },
 *  { type: "shorts", items: [{ type: "short", entry }] },
 *  { type: "post", entry },
 *  ...
 * ]
 */
function buildTimeline(posts, shorts) {
  const timeline = [];

  const readables = [
    ...posts.map((post) => ({ type: "post", entry: post })),
    ...shorts.map((short) => ({ type: "short", entry: short })),
  ].sort((a, b) => new Date(b.entry.publishedAt) - new Date(a.entry.publishedAt));

  for (const readable of readables) {
    if (readable.type === "post") {
      timeline.push(readable);
    } else {
      let group = timeline.at(-1);
      if (!group || group.type !== "shorts") timeline.push((group = { type: "shorts", items: [] }));
      group.items.push(readable.entry);
    }
  }

  return timeline;
}

function skipped(slug, reason) {
  console.warn(`Skipping entry with slug ${slug}: ${reason}`);
  return undefined;
}
