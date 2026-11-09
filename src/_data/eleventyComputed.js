export default {
  pageMetadata: (data) => {
    const title = data.title;
    const { post, short, category, pageContent, page } = data;
    const article = post || short;
    const isHome = page.url === '/';
    const metaTitle = isHome ? 'timomeh.de' : short ? shortTitle(short.plainText) : title;
    let description;

    if (post) description = post.meta.description;
    else if (short) description = short.plainText;
    else if (category) {
      description = category.meta.description || category.description;
      if (!description?.trim()) description = `More or less coherent thoughts about ${category.title}.`;
    } else if (pageContent) description = pageContent.meta.description;
    else if (isHome) description = 'A blog about software development, music, my life, and other random thoughts I wanted to elaborate on.';

    return {
      title: metaTitle,
      documentTitle: isHome ? 'timomeh.de' : `${metaTitle} | timomeh.de`,
      description,
      locale: post?.meta.lang || short?.meta.lang || 'en_US',
      type: article ? 'article' : 'website',
      article,
    };
  },
};

function shortTitle(text) {
  if (!text) return 'Timo thinks…';

  const available = 60 - 'Timo: “”'.length;
  let excerpt = text;
  if (excerpt.length > available) {
    excerpt = excerpt.slice(0, available - 1);
    const space = excerpt.lastIndexOf(' ');
    if (space > 0) excerpt = excerpt.slice(0, space);
    excerpt = `${excerpt.trim()}…`;
  }
  return `Timo: “${excerpt}”`;
}
