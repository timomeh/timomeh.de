import path from "node:path";
import Image from "@11ty/eleventy-img";
import { contentDir } from "./constants.js";
import { timeBuildStage } from "./build-timing.js";

const widths = [320, 640, 960, 1280, 2048];

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

  // don't process gif's or svg's
  const passthrough = /\.(?:gif|svg)$/i.test(file);

  const imageMeta = await Image(file, {
    widths,
    formats: passthrough ? ["passthrough"] : ["webp", "auto"],
    outputDir: path.join(process.env.OUTPUT_DIR || "_site", "img"),
    urlPath: "/img/",
    fixOrientation: true,
  });

  let placeholderMeta = null;
  if (!passthrough) {
    placeholderMeta = await Image(file, {
      widths: [24],
      formats: ["webp"],
      dryRun: true,
      fixOrientation: true,
    });
  }

  const formats = Object.values(imageMeta);
  const fallback = formats.at(-1);
  const largest = fallback.at(-1);

  return {
    width: largest.width,
    height: largest.height,
    src: largest.url,
    srcset: fallback.map((image) => image.srcset).join(", "),
    feed: (fallback.find((image) => image.width >= 960) || largest).url,
    webp: imageMeta.webp?.map((image) => image.srcset).join(", "),
    placeholder: placeholderMeta
      ? `data:image/webp;base64,${placeholderMeta.webp[0].buffer.toString("base64")}`
      : largest.url,
  };
}
