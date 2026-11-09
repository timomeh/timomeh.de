window.BlogApp ||= {};
BlogApp.Cover ||= {};

const state = {
  coverClone: null,
};

BlogApp.Cover.prepareCrossfade = () => {
  state.coverClone?.remove();
  state.coverClone = null;

  if (!shouldCrossfade()) return;

  const cover = document.querySelector('#page-backdrop .PostCover[data-context="page"]');
  if (cover) {
    state.coverClone = cover.cloneNode(true);
    state.coverClone.setAttribute("aria-hidden", "true");
    document.body.append(state.coverClone);
  }
};

BlogApp.Cover.crossfade = () => {
  const oldCover = state.coverClone;

  if (!shouldCrossfade()) {
    oldCover?.remove();
    state.coverClone = null;
    return;
  }

  const newCover = document.querySelector('#page-backdrop .PostCover[data-context="page"]');
  const duration = 450;

  if (newCover) {
    newCover.animate([{ opacity: 0 }, { opacity: 0.9 }], {
      duration,
      easing: "ease-in-out",
    });
  }

  if (oldCover) {
    const fadeoutAnimation = oldCover.animate([{ opacity: 0.9 }, { opacity: 0 }], {
      duration,
      easing: "ease-in-out",
    });

    const cleanup = () => {
      oldCover.remove();
      if (state.coverClone === oldCover) {
        state.coverClone = undefined;
      }
    };

    fadeoutAnimation.finished.then(cleanup, cleanup);
  }
};

function shouldCrossfade() {
  return !hasReducedMotion() && canAnimate();
}

function hasReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canAnimate() {
  return Boolean(Element.prototype.animate);
}
