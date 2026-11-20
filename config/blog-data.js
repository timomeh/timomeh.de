import { contentDir } from "./lib/constants.js";
import { clearFileHashes } from "./lib/file-hash.js";
import { clearImageCache } from "./lib/imageoptim.js";

/** Watches blog content and clears shared content caches before each build. */
export default function blogDataPlugin(eleventyConfig) {
  eleventyConfig.addWatchTarget(contentDir);
  eleventyConfig.on("eleventy.before", clearImageCache);
  eleventyConfig.on("eleventy.before", clearFileHashes);
}
