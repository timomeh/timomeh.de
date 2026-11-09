window.BlogApp ||= {};

if (window.Swup && window.SwupHeadPlugin && window.SwupA11yPlugin) {
  const swup = new window.Swup({
    containers: ["#page-backdrop", "#site-nav", "#header-kicker", "#page-content"],
    plugins: [new window.SwupHeadPlugin(), new window.SwupA11yPlugin()],
  });

  swup.hooks.on("content:replace", () => {
    window.BlogApp.Kicker?.randomize();
  });

  swup.hooks.on("content:replace", () => {
    window.BlogApp.Navbar?.render();
  });

  swup.hooks.on("content:replace", () => {
    const backdrop = document.querySelector("#page-backdrop");
    const effects = document.querySelector(".HeaderEffects");
    if (backdrop && effects) effects.dataset.hasCover = backdrop.dataset.hasCover;
  });

  swup.hooks.on("visit:start", () => {
    window.Fancybox?.close();
  });

  swup.hooks.before("content:replace", () => {
    window.BlogApp.Cover?.prepareCrossfade();
  });

  swup.hooks.on("content:replace", () => {
    window.BlogApp.Cover?.crossfade();
  });
}
