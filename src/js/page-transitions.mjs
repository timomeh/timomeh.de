import { swup } from "site/swup";

swup?.hooks.on("content:replace", () => {
  const backdrop = document.querySelector("#page-backdrop");
  const effects = document.querySelector("blog-header-backdrop");
  if (backdrop && effects) effects.dataset.hasCover = backdrop.dataset.hasCover;
});
