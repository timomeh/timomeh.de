export default function filtersPlugin(eleventyConfig) {
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
}
