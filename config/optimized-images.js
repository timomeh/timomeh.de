import { glob, stat } from "node:fs/promises";
import path from "node:path";
import Image from "@11ty/eleventy-img";

/**
 * Registers a Liquid filter that generates responsive images on demand.
 * The glob determines which source images can be used; matching files are not
 * processed until the filter is called. Results are cached for the current build.
 *
 * @param {object} eleventyConfig - The Eleventy configuration API.
 * @param {object} options - Plugin configuration.
 * @param {string} options.pattern - Glob of source images, relative to the project root.
 * @param {string} options.outputDir - Filesystem directory for generated images.
 * @param {string} options.urlPath - Public URL prefix for generated images.
 * @param {string} options.filterName - Name of the Liquid filter to register.
 * @param {(width: number) => number[]} options.sizes - Maps the requested width to output widths in pixels.
 * @param {string[]} options.formats - Output formats; must include "webp", which the filter returns.
 *
 * @example Register the plugin in eleventy.config.js
 *   eleventyConfig.addPlugin(optimizedImagesPlugin, {
 *     pattern: "src/images/*",
 *     outputDir: path.join(output, "img"),
 *     urlPath: "/img/",
 *     filterName: "imageUrl",
 *     sizes: (width) => [width, width * 2, width * 3],
 *     formats: ["webp"],
 *   });
 *
 * @example Generate attributes for a source path and display width in Liquid
 *   {% assign foo = 'src/images/foo.png' | imageUrl: 80 %}
 *   <img src="{{ foo.src }}" srcset="{{ foo.srcset }}" sizes="80px" width="80" height="80" alt="">
 */
export default function optimizedImagesPlugin(eleventyConfig, options) {
  const { pattern, outputDir, urlPath, filterName, sizes, formats } = options;

  const sourcePaths = new Map();
  const cache = new Map();

  eleventyConfig.addWatchTarget(pattern);

  // Collect all available files that can be used in the liquid filter.
  eleventyConfig.on("eleventy.before", async () => {
    const nextSourcePaths = new Map();

    // Go over all globbed files that match the pattern.
    for await (const sourcePath of glob(pattern)) {
      if (!(await stat(sourcePath)).isFile()) continue;

      // Always use forward slashes in Liquid lookup keys.
      const lookupKey = sourcePath.split(path.sep).join("/");
      nextSourcePaths.set(lookupKey, sourcePath);
    }

    // Only set new `sourcePaths` after all files were processed.
    // Keep the previous lookup intact if the build fails partway through.
    sourcePaths.clear();
    for (const [lookupKey, sourcePath] of nextSourcePaths) {
      sourcePaths.set(lookupKey, sourcePath);
    }

    cache.clear();
  });

  // Add the filter that generates and saves an optimized image, and returns the
  // `src` and `srcset` attributes to be used in image tags.
  eleventyConfig.addLiquidFilter(filterName, (lookupKey, width) => {
    const sourcePath = sourcePaths.get(lookupKey);

    if (!sourcePath) {
      throw new Error(`No image for "${lookupKey}" using pattern "${pattern}"`);
    }

    if (!Number.isInteger(width) || width <= 0) {
      throw new Error(`Invalid image width: ${width}`);
    }

    const cacheKey = `${lookupKey}:${width}`;

    if (!cache.has(cacheKey)) {
      const result = Image(sourcePath, {
        widths: sizes(width),
        formats,
        outputDir,
        urlPath,
      }).then(({ webp }) => ({
        src: (webp[1] || webp[0]).url,
        srcset: webp.map((image) => `${image.url} ${image.width}w`).join(", "),
      }));

      cache.set(cacheKey, result);
    }

    return cache.get(cacheKey);
  });
}
