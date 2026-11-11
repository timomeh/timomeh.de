window.BlogApp ||= {};

if (window.Swup && window.SwupHeadPlugin && window.SwupA11yPlugin && window.SwupParallelPlugin) {
  const swup = new window.Swup({
    containers: ["#page-backdrop", "#page-cover", "nav-bar", "random-kicker", "#page-content"],
    animationSelector: '.PostCover[data-context="page"]',
    plugins: [
      new window.SwupHeadPlugin(),
      new window.SwupA11yPlugin(),
      new window.SwupParallelPlugin({ containers: ["#page-cover"] }),
    ],
  });

  window.BlogApp.swup = swup;

  swup.hooks.on("content:replace", () => {
    const backdrop = document.querySelector("#page-backdrop");
    const effects = document.querySelector(".HeaderEffects");
    if (backdrop && effects) effects.dataset.hasCover = backdrop.dataset.hasCover;
  });

  swup.hooks.on("visit:start", () => {
    window.Fancybox?.close();
  });
}
