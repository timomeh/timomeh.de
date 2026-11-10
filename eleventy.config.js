import { rssPlugin, dateToRfc3339, dateToRfc822 } from "@11ty/eleventy-plugin-rss";
import { contentDir, site } from "./lib/constants.js";
import { configureAssets } from "./lib/assets.js";
import { generateOgImage } from "./lib/og-image.js";
import { reportBuildTiming } from "./lib/build-timing.js";
import { clearImageCache } from "./lib/imageoptim.js";

export default function (eleventyConfig) {
  const output = process.env.OUTPUT_DIR || "_site";
  configureAssets(eleventyConfig, output);
  eleventyConfig.on("eleventy.before", clearImageCache);
  eleventyConfig.on("eleventy.after", reportBuildTiming);
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

  const feedShortTitle = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
  eleventyConfig.addFilter("feedShortTitle", (date) => feedShortTitle.format(new Date(date)));

  const dateLabel = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  });
  eleventyConfig.addFilter("dateLabel", (date) => dateLabel.format(new Date(date)));

  eleventyConfig.addFilter("pluralize", (count, singular, plural) =>
    Number(count) === 1 ? singular : plural,
  );

  const shortDateTime = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
  eleventyConfig.addFilter("shortDateTime", (date) => shortDateTime.format(new Date(date)));

  const postDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
  eleventyConfig.addFilter("postDate", (date) => postDate.format(new Date(date)));

  return { dir: { input: "src", output } };
}
