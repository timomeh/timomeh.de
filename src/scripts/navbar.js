window.BlogApp ||= {};
BlogApp.Navbar ||= {};

const state = {
  isFloating: false,
  isVisible: false,
  scrollY: Math.max(0, window.scrollY),
};

/*
- `scrollFloating` switches the nav from its normal position at the top of the
   page to a fixed position above the viewport. On its own, the floating nav is hidden.
- `scrollVisible` moves the floating nav into view. Removing it moves the nav back off-screen.
- `scrollReady` enables the transform transition, so subsequent show/hide changes animate.
   It's added after the initial move off-screen, so that move doesn't animate.
*/

BlogApp.Navbar.render = () => {
  const nav = document.querySelector("#site-nav");
  if (!nav) return;

  if (!state.isFloating) {
    nav.dataset.scrollFloating = "false";
    nav.dataset.scrollVisible = "false";
    nav.dataset.scrollReady = "false";
    return;
  }

  if (nav.dataset.scrollFloating !== "true") {
    nav.dataset.scrollFloating = "true";

    // Delay style update so that floating and ready styles aren't applied in one batch.
    // So the navbar can transition into the viewport from the top.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (nav.dataset.scrollFloating === "true") {
          nav.dataset.scrollReady = "true";
        }
      });
    });
  }

  nav.dataset.scrollVisible = state.isVisible ? "true" : "false";
};

function update() {
  const nav = document.querySelector("#site-nav");
  if (!nav) return;

  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const y = Math.max(0, Math.min(window.scrollY, maxScroll));
  const topArea = nav.offsetHeight + 32;

  if (y === 0) {
    state.isFloating = false;
    state.isVisible = false;
    state.scrollY = y;
  } else if (state.isFloating || y > topArea) {
    state.isFloating = true;
    if (Math.abs(y - state.scrollY) >= 12) {
      state.isVisible = y < state.scrollY;
      state.scrollY = y;
    }
  } else {
    state.scrollY = y;
  }

  BlogApp.Navbar.render();
}

window.addEventListener("scroll", update, { passive: true });
update();

document.addEventListener("click", (event) => {
  // close open menu on outside click
  const menu = document.querySelector("#site-menu[open]");
  if (menu && !menu.contains(event.target)) {
    menu.open = false;
  }
});

document.addEventListener("keydown", (event) => {
  // close open menu on escape key
  if (event.key !== "Escape") return;
  const menu = document.querySelector("#site-menu[open]");
  if (menu) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});
