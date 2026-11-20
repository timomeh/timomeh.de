import { generateOgImage } from "./lib/og-image.js";

export default function openGraphPlugin(eleventyConfig) {
  eleventyConfig.addLiquidShortcode("overviewOgImage", (title) =>
    generateOgImage({ title }, null, "pages"),
  );
}
