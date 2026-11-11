window.BlogApp ||= {};

class NavBar extends HTMLElement {
  #state = {
    isFloating: false,
    isVisible: false,
    scrollY: Math.max(0, window.scrollY),
  };

  connectedCallback() {
    this.#setupListeners();
    this.#update();
  }

  #setupListeners() {
    window.addEventListener(
      "scroll",
      () => {
        this.#update();
      },
      { passive: true },
    );

    window.BlogApp.swup?.hooks.on("content:replace", () => {
      this.#render();
    });
  }

  #render() {
    const shouldFloat = this.#state.isFloating;
    if (!shouldFloat) {
      this.#setCurrentlyCloating(false);
      this.#setCurrentlyVisible(false);
      this.#setCurrentlyReady(false);
      return;
    }

    const currentlyFloating = this.#getCurrentlyFloating();
    if (!currentlyFloating) {
      this.#setCurrentlyCloating(true);

      // Delay style update so that floating and ready styles aren't applied in one batch.
      // So the navbar can transition into the viewport from the top.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (this.#getCurrentlyFloating()) {
            this.#setCurrentlyReady(true);
          }
        });
      });
    }

    this.#setCurrentlyVisible(this.#state.isVisible);
  }

  #update() {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const y = Math.max(0, Math.min(window.scrollY, maxScroll));
    const topArea = this.offsetHeight + 32;

    if (y === 0) {
      this.#state.isFloating = false;
      this.#state.isVisible = false;
      this.#state.scrollY = 0;
    } else if (this.#state.isFloating || y > topArea) {
      this.#state.isFloating = true;

      if (Math.abs(y - this.#state.scrollY) >= 12) {
        this.#state.isVisible = y < this.#state.scrollY;
        this.#state.scrollY = y;
      }
    } else {
      this.#state.scrollY = y;
    }

    this.#render();
  }

  #getCurrentlyFloating() {
    return this.dataset.scrollFloating === "true";
  }

  #setCurrentlyCloating(isFloating) {
    this.dataset.scrollFloating = isFloating;
  }

  #setCurrentlyVisible(isVisible) {
    this.dataset.scrollVisible = isVisible;
  }

  #setCurrentlyReady(isReady) {
    this.dataset.scrollReady = isReady;
  }
}

customElements.define("nav-bar", NavBar);
