import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { rssPlugin, dateToRfc3339, dateToRfc822 } from "@11ty/eleventy-plugin-rss";
import { contentDir, site } from "./lib/constants.js";

export default function (eleventyConfig) {
  const output = process.env.OUTPUT_DIR || "_site";
  eleventyConfig.addGlobalData("site", { url: new URL("/", site).href });
  eleventyConfig.addPlugin(rssPlugin);

  eleventyConfig.addWatchTarget(contentDir);
  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addWatchTarget("src/scripts/");
  eleventyConfig.on("eleventy.before", async () => {
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
      "node_modules/@fancyapps/ui/dist/fancybox/fancybox.umd.js",
    ];

    const [styles, scripts, vendorCss, vendorJs] = await Promise.all([
      Promise.all((await sourceFiles("src/styles", ".css")).map((file) => readFile(file, "utf8"))),
      Promise.all((await sourceFiles("src/scripts", ".js")).map((file) => readFile(file, "utf8"))),
      Promise.all(vendorStyles.map((file) => readFile(file, "utf8"))),
      Promise.all(vendorScripts.map((file) => readFile(file, "utf8"))),
    ]);

    await mkdir(output, { recursive: true });

    await Promise.all([
      writeFile(
        path.join(output, "style.css"),
        `@layer vendor {\n${vendorCss.join("\n\n")}\n}\n\n${styles.join("\n\n")}`,
      ),
      writeFile(
        path.join(output, "app.js"),
        `${vendorJs.join("\n;\n")}\n${scripts.map((script) => `;(() => {\n${script}\n})();`).join("\n")}\n`,
      ),
    ]);
  });

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2":
      "fonts/inter-latin-wght-normal.woff2",
    "node_modules/@fontsource-variable/inter/files/inter-latin-wght-italic.woff2":
      "fonts/inter-latin-wght-italic.woff2",
    "node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2":
      "fonts/inter-latin-ext-wght-normal.woff2",
    "node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-italic.woff2":
      "fonts/inter-latin-ext-wght-italic.woff2",
    "node_modules/@fontsource-variable/bitter/files/bitter-latin-wght-normal.woff2":
      "fonts/bitter-latin-wght-normal.woff2",
    "node_modules/@fontsource-variable/bitter/files/bitter-latin-ext-wght-normal.woff2":
      "fonts/bitter-latin-ext-wght-normal.woff2",
    "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2":
      "fonts/ibm-plex-mono-latin-400-normal.woff2",
    "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2":
      "fonts/ibm-plex-mono-latin-500-normal.woff2",
    "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2":
      "fonts/ibm-plex-mono-latin-600-normal.woff2",
    "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-700-normal.woff2":
      "fonts/ibm-plex-mono-latin-700-normal.woff2",
    "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-400-normal.woff2":
      "fonts/ibm-plex-mono-latin-ext-400-normal.woff2",
    "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-500-normal.woff2":
      "fonts/ibm-plex-mono-latin-ext-500-normal.woff2",
    "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-600-normal.woff2":
      "fonts/ibm-plex-mono-latin-ext-600-normal.woff2",
    "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-700-normal.woff2":
      "fonts/ibm-plex-mono-latin-ext-700-normal.woff2",
  });

  eleventyConfig.addFilter("absoluteUrl", (url) => new URL(url, site).href);
  eleventyConfig.addLiquidFilter("dateToRfc3339", dateToRfc3339);
  eleventyConfig.addLiquidFilter("dateToRfc822", dateToRfc822);
  eleventyConfig.addFilter("dateIso", (date) => new Date(date).toISOString());

  eleventyConfig.addFilter("feedShortTitle", (date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    }).format(new Date(date)),
  );

  eleventyConfig.addFilter("dateLabel", (date) =>
    new Intl.DateTimeFormat("en", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(date)),
  );

  eleventyConfig.addFilter("pluralize", (count, singular, plural) =>
    Number(count) === 1 ? singular : plural,
  );

  eleventyConfig.addFilter("shortDateTime", (date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    }).format(new Date(date)),
  );

  eleventyConfig.addFilter("postDate", (date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date)),
  );

  return { dir: { input: "src", output } };
}
