import { createHash } from "node:crypto";
import { glob, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Copies matching files with content-hashed names and registers a Liquid filter
 * that returns their public URLs. All matching files are copied on each build;
 * file contents and references within them are not modified.
 *
 * @param {object} eleventyConfig - The Eleventy configuration API.
 * @param {object} options - Plugin configuration.
 * @param {string} options.pattern - Glob of source files, relative to the project root.
 * @param {string} options.outputDir - Filesystem directory for fingerprinted files.
 * @param {string} options.urlPath - Public URL prefix for fingerprinted files.
 * @param {string} options.filterName - Name of the Liquid filter to register.
 *
 * @example Register the plugin in eleventy.config.js
 *   eleventyConfig.addPlugin(fingerprintPlugin, {
 *     pattern: "src/css/*.css",
 *     outputDir: path.join(output, "static"),
 *     urlPath: "/static",
 *     filterName: "cssUrl",
 *   });
 *
 * @example Look up a source file in Liquid
 *   <link rel="stylesheet" href="{{ 'src/css/foo.css' | cssUrl }}">
 */
export default function fingerprintPlugin(eleventyConfig, options) {
  const { pattern, outputDir, urlPath, filterName } = options;

  const urls = new Map();

  // normalize urlPath by removing trailing slashes
  const publicDir = urlPath.replace(/\/+$/, "");

  eleventyConfig.addWatchTarget(pattern);

  // Collect all available files that can be used in the liquid filter
  eleventyConfig.on("eleventy.before", async () => {
    await mkdir(outputDir, { recursive: true });

    const nextUrls = new Map();

    // Go over all globbed files that match the pattern.
    for await (const sourcePath of glob(pattern)) {
      if (!(await stat(sourcePath)).isFile()) continue;

      const contents = await readFile(sourcePath);
      const hash = createHash("sha256").update(contents).digest("hex").slice(0, 16);

      const { name, ext } = path.parse(sourcePath);
      const outputName = `${name}.${hash}${ext}`;

      await writeFile(path.join(outputDir, outputName), contents);

      // Always use forward slashes in Liquid lookup keys.
      const lookupKey = sourcePath.split(path.sep).join("/");
      nextUrls.set(lookupKey, `${publicDir}/${outputName}`);
    }

    // Only set new `urls` after all files were processed.
    // Keep the previous lookup intact if the build fails partway through.
    urls.clear();
    for (const [sourcePath, url] of nextUrls) {
      urls.set(sourcePath, url);
    }
  });

  // Add the filter that returns the fingerprinted URL based on the source path
  eleventyConfig.addFilter(filterName, (sourcePath) => {
    const url = urls.get(sourcePath);

    if (!url) {
      throw new Error(`No fingerprinted file for "${sourcePath}" using pattern "${pattern}"`);
    }

    return url;
  });
}
