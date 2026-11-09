import { rssPlugin, dateToRfc3339, dateToRfc822 } from "@11ty/eleventy-plugin-rss";
import { contentDir, site } from "./lib/constants.js";
import { configureAssets } from "./lib/assets.js";
import { generateOgImage } from "./lib/og-image.js";

export default function (eleventyConfig) {
  const output = process.env.OUTPUT_DIR || "_site";
  configureAssets(eleventyConfig, output);
  eleventyConfig.addGlobalData("site", { url: new URL("/", site).href });
  eleventyConfig.addPlugin(rssPlugin);

  eleventyConfig.addWatchTarget(contentDir);
  eleventyConfig.addPassthroughCopy("src/_headers");

  eleventyConfig.addFilter("absoluteUrl", (url) => new URL(url, site).href);
  eleventyConfig.addLiquidShortcode("overviewOgImage", (title) =>
    generateOgImage({ title }, null, "pages"),
  );
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
