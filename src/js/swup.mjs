const hasSwup =
  window.Swup && window.SwupHeadPlugin && window.SwupA11yPlugin && window.SwupParallelPlugin;

export const swup = hasSwup
  ? new window.Swup({
      containers: [
        "#page-backdrop",
        "#page-cover",
        "blog-nav-bar",
        "random-kicker",
        "#page-content",
      ],
      animationSelector: "#page-cover",
      plugins: [
        new window.SwupHeadPlugin({
          awaitAssets: true,
          persistTags: 'link[rel="stylesheet"]',
        }),
        new window.SwupA11yPlugin(),
        new window.SwupParallelPlugin({ containers: ["#page-cover"] }),
      ],
    })
  : null;
