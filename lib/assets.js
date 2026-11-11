import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import Image from "@11ty/eleventy-img";
import { timeBuildStage } from "./build-timing.js";

// - in JS and CSS, files from assets/* can be referenced with static/*.
//   e.g. writing /static/foo.png will take /assets/foo.png and fingerprint it for cache busting.
// - in templates, use the assetUrl filter can be used with any file in assets/* or predefined files, like fonts.
//   e.g. {{ 'foo.png' | assetUrl }} will turn it into a fingerprinted URL.

// Fonts are referenced by their original filenames in CSS and preload links.
const fontFiles = [
  "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  "node_modules/@fontsource-variable/inter/files/inter-latin-wght-italic.woff2",
  "node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2",
  "node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-italic.woff2",
  "node_modules/@fontsource-variable/bitter/files/bitter-latin-wght-normal.woff2",
  "node_modules/@fontsource-variable/bitter/files/bitter-latin-ext-wght-normal.woff2",
  "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
  "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2",
  "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2",
  "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-700-normal.woff2",
  "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-400-normal.woff2",
  "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-500-normal.woff2",
  "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-600-normal.woff2",
  "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-700-normal.woff2",
];

// Hash static files and provide their URLs and CSS/JS sources to Eleventy templates.
// Eleventy's Bundle plugin assembles and fingerprints the CSS and JS separately.
export function configureAssets(eleventyConfig, output) {
  const assets = new Map();
  const optimizedAssets = new Map();
  let bundleSources;
  const assetUrl = (name) => {
    const url = assets.get(name);
    if (!url) throw new Error(`Unknown asset: ${name}`);
    return url;
  };

  eleventyConfig.addBundle("css", { toFileDirectory: "static" });
  eleventyConfig.addBundle("js", { toFileDirectory: "static" });
  eleventyConfig.addGlobalData("bundleSources", () => bundleSources);
  eleventyConfig.addFilter("assetUrl", assetUrl);
  eleventyConfig.addLiquidFilter("optimizedAsset", (name, width) => {
    if (!assets.has(name) || path.basename(name) !== name) {
      throw new Error(`Unknown asset: ${name}`);
    }
    if (!Number.isInteger(width) || width <= 0) throw new Error(`Invalid image width: ${width}`);
    const key = `${name}:${width}`;
    if (!optimizedAssets.has(key)) {
      const result = Image(path.join("src/assets", name), {
        widths: [width, width * 2, width * 3],
        formats: ["webp"],
        outputDir: path.join(output, "img"),
        urlPath: "/img/",
      }).then(({ webp }) => ({
        src: (webp[1] || webp[0]).url,
        srcset: webp.map((image) => `${image.url} ${image.width}w`).join(", "),
      }));
      optimizedAssets.set(key, result);
    }
    return optimizedAssets.get(key);
  });
  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addWatchTarget("src/scripts/");
  eleventyConfig.addWatchTarget("src/assets/");

  eleventyConfig.on("eleventy.before", () => timeBuildStage("Prepare assets", async () => {
    const sourceFiles = async (dir, extension) =>
      (await readdir(dir))
        .filter((file) => file.endsWith(extension))
        .sort()
        .map((file) => path.join(dir, file));
    const vendorStyles = ["node_modules/@fancyapps/ui/dist/fancybox/fancybox.css"];
    const vendorScripts = [
      "node_modules/swup/dist/Swup.umd.js",
      "node_modules/@swup/head-plugin/dist/index.umd.js",
      "node_modules/@swup/a11y-plugin/dist/index.umd.js",
      "node_modules/@swup/parallel-plugin/dist/index.umd.js",
      "node_modules/@fancyapps/ui/dist/fancybox/fancybox.umd.js",
    ];

    const [styles, scripts, vendorCss, vendorJs] = await Promise.all([
      Promise.all((await sourceFiles("src/styles", ".css")).map((file) => readFile(file, "utf8"))),
      Promise.all((await sourceFiles("src/scripts", ".js")).map((file) => readFile(file, "utf8"))),
      Promise.all(vendorStyles.map((file) => readFile(file, "utf8"))),
      Promise.all(vendorScripts.map((file) => readFile(file, "utf8"))),
    ]);

    const writeHashed = async (name, content) => {
      const ext = path.extname(name);
      const hash = createHash("sha256").update(content).digest("hex").slice(0, 16);
      const filename = `${path.basename(name, ext)}.${hash}${ext}`;
      await mkdir(path.join(output, "static"), { recursive: true });
      await writeFile(path.join(output, "static", filename), content);
      return `/static/${filename}`;
    };

    assets.clear();
    optimizedAssets.clear();
    for (const name of await readdir("src/assets")) {
      const content = await readFile(path.join("src/assets", name));
      assets.set(name, await writeHashed(name, content));
    }
    for (const source of fontFiles) {
      const name = path.basename(source);
      assets.set(name, await writeHashed(name, await readFile(source)));
    }
    // you can add more asset references here by adding them to the assets map.

    // CSS uses /static/<filename> as a source placeholder. These get replaced
    // with the fingerprinted URLs.
    const resolveAssets = (css) =>
      css.replace(/\/static\/([\w.-]+)/g, (_, name) => assetUrl(name));
    bundleSources = {
      vendorCss: vendorCss.map(resolveAssets),
      styles: styles.map(resolveAssets),
      vendorJs,
      scripts,
    };
  }));
}
