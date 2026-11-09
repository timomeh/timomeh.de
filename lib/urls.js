export function postUrl(slug) {
  return `/posts/${slug}/`;
}

export function shortUrl(slug) {
  return `/shorts/${slug}/`;
}

export function pageUrl(pagePath, slug) {
  return `/${pagePath || slug}/`;
}
