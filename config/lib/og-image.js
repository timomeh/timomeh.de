import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import Image from "@11ty/eleventy-img";
import * as fontkit from "fontkit";
import { contentDir } from "./constants.js";
import { hashFile } from "./file-hash.js";

// holy vibecoded slop

const output = process.env.OUTPUT_DIR || "_site";
// SVG rasterizers don't reliably load web fonts via @font-face. Turn the same
// fonts used by the site into paths, including their language subsets.
const titleFontFiles = ["latin", "latin-ext", "vietnamese", "cyrillic", "cyrillic-ext"].map(
  (subset) => `node_modules/@fontsource/bitter/files/bitter-${subset}-600-normal.woff2`,
);
const monoFontFiles = ["latin", "latin-ext"].map(
  (subset) =>
    `node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-${subset}-400-normal.woff2`,
);
const titleFonts = titleFontFiles.map((file) => fontkit.openSync(file));
const monoFonts = monoFontFiles.map((file) => fontkit.openSync(file));
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const emojiCache = new Map();

function emojiImage(char) {
  if (!/\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20e3/u.test(char)) return null;
  if (!emojiCache.has(char)) {
    const code = Array.from(char, (part) => part.codePointAt(0).toString(16));
    const filename = (parts) => path.join("node_modules/@twemoji/svg", `${parts.join("-")}.svg`);
    let file = filename(code);
    if (!existsSync(file)) file = filename(code.filter((part) => part !== "fe0f"));
    emojiCache.set(char, existsSync(file) ? readFileSync(file).toString("base64") : null);
  }
  return emojiCache.get(char);
}

// Keep text within the card even for unusually long titles or unbroken words.
function titleLines(title) {
  const words = Array.from(title.trim().split(/\s+/)).flatMap(
    (word) => word.match(/.{1,24}/gu) || [],
  );
  const lines = [];
  for (const word of words) {
    const last = lines.length - 1;
    if (last >= 0 && `${lines[last]} ${word}`.length <= 26) lines[last] += ` ${word}`;
    else lines.push(word);
  }
  return lines;
}

function shapeText(line, fonts, fontSize, render = false) {
  let cursor = 0;
  let paths = "";
  // Shape consecutive characters from the same subset together so kerning and
  // combining marks are preserved wherever the font supports them.
  const runs = [];
  for (const { segment: char } of graphemes.segment(line)) {
    const emoji = emojiImage(char);
    if (emoji) {
      runs.push({ emoji });
      continue;
    }
    const font =
      fonts.find((candidate) => candidate.hasGlyphForCodePoint(char.codePointAt(0))) || fonts[0];
    const last = runs.at(-1);
    if (last?.font === font) last.text += char;
    else runs.push({ font, text: char });
  }
  for (const { font, text, emoji } of runs) {
    if (emoji) {
      if (render)
        paths += `<image href="data:image/svg+xml;base64,${emoji}" x="${cursor}" y="${-fontSize * 0.85}" width="${fontSize}" height="${fontSize}"/>`;
      cursor += fontSize;
      continue;
    }
    const { glyphs, positions } = font.layout(text);
    const scale = fontSize / font.unitsPerEm;
    glyphs.forEach((glyph, index) => {
      const position = positions[index];
      if (render)
        paths += `<path d="${glyph.path.toSVG()}" transform="translate(${cursor + position.xOffset * scale} ${-position.yOffset * scale}) scale(${scale} ${-scale})"/>`;
      cursor += position.xAdvance * scale;
    });
  }
  return { paths, width: cursor };
}

function textPath(line, fonts, x, y, fontSize, maxWidth = 1040) {
  const { paths, width } = shapeText(line, fonts, fontSize, true);
  // Only scale down, uniformly, if a line is wider than the available space.
  const fit = Math.min(1, maxWidth / (width || 1));
  return `<g transform="translate(${x} ${y}) scale(${fit})">${paths}</g>`;
}

// Fit all of a short's text in the space between the identity and the date.
function shortLayout(text, maxWidth = 1040) {
  const paragraphs = text.trim().split(/\r\n|\r|\n/);
  const widths = new Map();
  const width = (value) => {
    if (!widths.has(value)) widths.set(value, shapeText(value, titleFonts, 1).width);
    return widths.get(value);
  };
  function wrap(size) {
    const max = maxWidth / size;
    const lines = [];
    for (const paragraph of paragraphs) {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        continue;
      }
      let line = "";
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (width(candidate) <= max) {
          line = candidate;
          continue;
        }
        if (line) lines.push(line);
        line = "";
        for (const { segment } of graphemes.segment(word)) {
          if (line && width(line + segment) > max) {
            lines.push(line);
            line = "";
          }
          line += segment;
        }
      }
      if (line) lines.push(line);
    }
    return lines;
  }
  let low = 0;
  let high = 54;
  for (let i = 0; i < 16; i++) {
    const size = (low + high) / 2;
    if (wrap(size).length * size * 1.25 <= 345) low = size;
    else high = size;
  }
  return { lines: wrap(low), fontSize: low };
}

export async function generateOgImage(entry, sourceDir, kind = "posts") {
  const cover = kind === "posts" && (entry.cover.dark || entry.cover.light);
  const attachment =
    kind === "shorts" && entry.attachments?.[0]?.image ? entry.attachments[0].attachment : null;
  const cache = await getOgImageCache(entry, sourceDir, kind, cover, attachment);
  if (cache.url) return cache.url;

  const grain = await Image("src/css/assets/grainy-dark-v20261119.svg", {
    widths: [200],
    formats: ["png"],
    dryRun: true,
  });
  const grainData = grain.png[0].buffer.toString("base64");
  let background = "";
  if (cover && (/^https?:\/\//i.test(cover) || !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(cover))) {
    const file = /^https?:\/\//i.test(cover)
      ? cover
      : path.resolve(sourceDir, decodeURIComponent(cover.split(/[?#]/)[0]));
    if (!/^https?:\/\//i.test(file) && !file.startsWith(`${contentDir}${path.sep}`))
      throw new Error(`Image path outside content directory: ${cover}`);
    const image = await Image(file, {
      widths: [1200],
      formats: ["png"],
      dryRun: true,
      fixOrientation: true,
    });
    const data = image.png[0].buffer.toString("base64");
    background = `<image href="data:image/png;base64,${data}" width="1200" height="630" preserveAspectRatio="xMidYMid slice" opacity="0.55"/>`;
  } else if (!cover) {
    background = `<defs>
      <radialGradient id="aurora">
        <stop offset="0" stop-color="#286c54" stop-opacity="0.7"/>
        <stop offset="0.45" stop-color="#15372d" stop-opacity="0.57"/>
        <stop offset="1" stop-color="#15372d" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="600" cy="0" rx="800" ry="460" fill="url(#aurora)"/>`;
  }

  let shortImage = "";
  if (attachment) {
    const file = resolveContentImage(attachment, sourceDir);
    const image = await Image(file, {
      widths: [1200],
      formats: ["png"],
      dryRun: true,
      fixOrientation: true,
    });
    const data = image.png[0].buffer.toString("base64");
    shortImage = `<image href="data:image/png;base64,${data}" x="700" y="110" width="420" height="390" preserveAspectRatio="xMidYMid meet"/>`;
  }
  const textWidth = attachment ? 580 : 1040;
  const layout =
    kind === "shorts" ? shortLayout(entry.plainText?.trim() || "Timo thinks…", textWidth) : null;
  const lines = layout?.lines || titleLines(entry.title);
  const fontSize = layout?.fontSize || Math.min(70, 300 / Math.max(lines.length, 1));
  const lineHeight = fontSize * (layout ? 1.25 : 1.2);
  const startY = (layout ? 318 : 300) - ((lines.length - 1) * lineHeight) / 2;
  const title = lines
    .map((line, index) =>
      textPath(line, titleFonts, 80, startY + index * lineHeight, fontSize, textWidth),
    )
    .join("");
  const date =
    kind === "pages"
      ? null
      : new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(entry.publishedAt));
  let footerText = date;
  if (kind === "posts") footerText = `${date} · ${entry.readingTime}`;
  if (attachment && entry.attachments.length > 1)
    footerText = `${date} · 1 / ${entry.attachments.length}`;
  const footer = date
    ? `<path d="M80 520H1120" stroke="#b5b2ad" stroke-opacity="0.45"/>
    <g fill="#d7d4cf">${textPath(footerText, monoFonts, 80, 565, 22)}</g>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><pattern id="grain" width="200" height="200" patternUnits="userSpaceOnUse"><image href="data:image/png;base64,${grainData}" width="200" height="200"/></pattern></defs>
    <rect width="1200" height="630" fill="#0f0d0b"/>
    ${background}
    <rect width="1200" height="630" fill="#0f0d0b" opacity="0.2"/>
    <rect width="1200" height="630" fill="url(#grain)"/>
    <g fill="#d9fedb">${textPath("timomeh.de / Timo Mämecke", monoFonts, 80, 88, 25)}</g>
    <g fill="#f0efeb">${title}</g>
    ${shortImage}
    ${footer}
  </svg>`;
  const result = await Image(Buffer.from(svg), {
    widths: [1200],
    formats: ["jpeg"],
    outputDir: path.join(output, "img"),
    urlPath: "/img/",
    filenameFormat: (id, src, width, format) =>
      cache.filename || `og_${id}${width ? `-${width}` : ""}.${format}`,
  });
  return result.jpeg[0].url;
}

let rendererHash;
function getRendererHash() {
  if (!rendererHash) {
    const hash = createHash("sha256");
    for (const file of [
      "config/lib/og-image.js",
      "package-lock.json",
      "src/css/assets/grainy-dark-v20261119.svg",
      ...titleFontFiles,
      ...monoFontFiles,
    ]) {
      hash.update(readFileSync(file));
    }
    rendererHash = hash.digest("hex");
  }
  return rendererHash;
}

function resolveContentImage(url, sourceDir) {
  const file = path.resolve(sourceDir, decodeURIComponent(url.split(/[?#]/)[0]));
  if (!file.startsWith(`${contentDir}${path.sep}`))
    throw new Error(`Image path outside content directory: ${url}`);
  return file;
}

async function getOgImageCache(entry, sourceDir, kind, cover, attachment) {
  if (cover && /^https?:\/\//i.test(cover)) return {};

  const hash = createHash("sha256");
  hash.update(getRendererHash());
  hash.update(
    JSON.stringify([
      kind,
      entry.title,
      entry.plainText,
      entry.publishedAt,
      entry.readingTime,
      cover,
      attachment,
      attachment ? entry.attachments.length : null,
    ]),
  );
  for (const { segment } of graphemes.segment(
    kind === "shorts" ? entry.plainText || "Timo thinks…" : entry.title,
  )) {
    const emoji = emojiImage(segment);
    if (emoji) hash.update(emoji);
  }
  if (cover && !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(cover)) {
    hash.update(await hashFile(resolveContentImage(cover, sourceDir)));
  }
  if (attachment) hash.update(await hashFile(resolveContentImage(attachment, sourceDir)));
  const filename = `og_${hash.digest("hex")}.jpeg`;
  const url = existsSync(path.join(output, "img", filename)) ? `/img/${filename}` : null;
  return { filename, url };
}
