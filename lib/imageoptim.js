import path from "node:path";
import { readFile } from "node:fs/promises";
import Image from "@11ty/eleventy-img";
import { contentDir } from "./constants.js";
import { timeBuildStage } from "./build-timing.js";
import { recordMarkdownImage } from "./markdown/cache.js";
import { cachedImage } from "./image-cache.js";

const widths = [320, 640, 960, 1280, 2048];
const images = new Map();

export function clearImageCache() {
  images.clear();
}

export async function imageoptim(url, sourceDir) {
  return timeBuildStage("Optimize content images", () => optimizeImage(url, sourceDir));
}

async function optimizeImage(url, sourceDir) {
  if (!url || /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)) return null;
  let filename;
  try {
    filename = decodeURIComponent(url.split(/[?#]/)[0]);
  } catch {
    throw new Error(`Invalid image path: ${url}`);
  }
  const file = path.resolve(sourceDir, filename);
  if (!file.startsWith(`${contentDir}${path.sep}`)) {
    throw new Error(`Image path outside content directory: ${url}`);
  }

  if (!images.has(file)) {
    const result = cachedImage(file, () => processImage(file));
    images.set(file, result);
    result.catch(() => {
      if (images.get(file) === result) images.delete(file);
    });
  }
  const { image, outputs } = await images.get(file);
  recordMarkdownImage(file, outputs);
  return image;
}

async function processImage(file) {
  // don't process gif's or svg's
  const passthrough = /\.(?:gif|svg)$/i.test(file);

  const imageMeta = await Image(file, {
    widths,
    formats: passthrough ? ["passthrough"] : ["webp", "auto"],
    outputDir: path.join(process.env.OUTPUT_DIR || "_site", "img"),
    urlPath: "/img/",
    fixOrientation: true,
  });

  let placeholder = null;
  // GIFs keep their animation in the output, but use a static first frame for the glow.
  if (!/\.svg$/i.test(file)) {
    const placeholderMeta = await Image(file, {
      widths: [24],
      formats: ["webp"],
      outputDir: ".cache/image-placeholders",
      fixOrientation: true,
    });
    const placeholderBuffer = await readFile(placeholderMeta.webp[0].outputPath);
    placeholder = `data:image/webp;base64,${placeholderBuffer.toString("base64")}`;
  }

  const formats = Object.values(imageMeta);
  const fallback = formats.at(-1);
  const largest = fallback.at(-1);

  const image = {
    width: largest.width,
    height: largest.height,
    src: largest.url,
    srcset: fallback.map((image) => image.srcset).join(", "),
    feed: (fallback.find((image) => image.width >= 960) || largest).url,
    webp: imageMeta.webp?.map((image) => image.srcset).join(", "),
    placeholder: placeholder || largest.url,
  };
  return { image, outputs: formats.flat().map((item) => item.outputPath) };
}
