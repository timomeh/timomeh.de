import path from "node:path";
import { dateToRfc3339, dateToRfc822, rssPlugin } from "@11ty/eleventy-plugin-rss";

import blogDataPlugin from "./config/blog-data.js";
import filtersPlugin from "./config/filters.js";
import fingerprintPlugin from "./config/fingerprint.js";
import optimizedImagesPlugin from "./config/optimized-images.js";
import openGraphPlugin from "./config/open-graph.js";

import { site } from "./config/lib/constants.js";

export default function (eleventyConfig) {
  const output = process.env.OUTPUT_DIR || "_site";
  eleventyConfig.addGlobalData("site", { url: new URL("/", site).href });

  // RSS Plugin and necessary filters for it
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addLiquidFilter("dateToRfc3339", dateToRfc3339);
  eleventyConfig.addLiquidFilter("dateToRfc822", dateToRfc822);
  eleventyConfig.addFilter("absoluteUrl", (url) => new URL(url, site).href);

  // Adds all css files for all components to the head
  eleventyConfig.addBundle("componentStyles");
  eleventyConfig.addShortcode("linkCSS", function (sourcePath) {
    if (!this.page?.url) {
      throw new Error("linkCSS needs access to page.url");
    }

    const url = eleventyConfig.getFilter("cssUrl")(sourcePath);
    const escapedUrl = url.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
    const link = `<link rel="stylesheet" href="${escapedUrl}">`;

    eleventyConfig.getBundleManagers().componentStyles.addToPage(this.page.url, link);
    return "";
  });

  // Lifecycle helpers for _data/blog.js
  eleventyConfig.addPlugin(blogDataPlugin);

  // Custom filters
  eleventyConfig.addPlugin(filtersPlugin);

  // Open Graph Images for overview pages etc
  eleventyConfig.addPlugin(openGraphPlugin);

  // Add fingerprinted URLs for css files:
  // <link rel="stylesheet" href="{{ 'src/css/foo.css' | cssUrl }}">
  // Doesn't rewrite urls used inside CSS files!
  eleventyConfig.addPlugin(fingerprintPlugin, {
    pattern: "src/{css,_includes}/**/*.css",
    outputDir: path.join(output, "static"),
    urlPath: "/static",
    filterName: "cssUrl",
  });

  // Copy all static files used in css into the static dir.
  // They must be manually fingerprinted. They're not automatically fingerprinted.
  eleventyConfig.addPassthroughCopy({
    "src/css/fonts/*.woff2": "static",
    "src/css/assets/*.svg": "static",
  });

  // Add fingerprinted URLs for js files:
  // <script type="module" src="{{ 'src/js/foo.mjs' | jsUrl }}"></script>
  // Doesn't rewrite urls used inside JS files!
  eleventyConfig.addPlugin(fingerprintPlugin, {
    pattern: "src/js/**/*.{js,mjs}",
    outputDir: path.join(output, "static"),
    urlPath: "/static",
    filterName: "jsUrl",
  });

  // Add fingerprinted URLs for misc assets:
  // <link rel="apple-touch-icon" href="{{ 'apple-touch-icon.png' | assetUrl }}">
  eleventyConfig.addPlugin(fingerprintPlugin, {
    pattern: "src/assets/**/*",
    outputDir: path.join(output, "static"),
    urlPath: "/static",
    filterName: "assetUrl",
  });

  // Copy all public files to the root output dir.
  // For robots.txt, favicons etc.
  eleventyConfig.addPassthroughCopy({
    "src/public": "/",
  });

  // Add optimized images for static images:
  // {% assign foo = 'src/images/foo.png' | imageUrl: 80 %}
  // <img
  //   src="{{ foo.src }}"
  //   srcset="{{ foo.srcset }}"
  //   sizes="80px"
  //   width="80"
  //   height="80"
  //   alt=""
  // >
  eleventyConfig.addPlugin(optimizedImagesPlugin, {
    pattern: "src/assets/**/*",
    outputDir: path.join(output, "img"),
    urlPath: "/img/",
    filterName: "imageUrl",
    sizes: (width) => [width, width * 2, width * 3],
    formats: ["webp"],
  });

  return { dir: { input: "src", output } };
}
