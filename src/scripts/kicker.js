window.BlogApp ||= {};

class RandomKicker extends HTMLElement {
  connectedCallback() {
    this.el = document.querySelector("[data-blog-kicker]");
    this.options = [...document.querySelectorAll("[data-blog-kicker-option]")];
    this.#shuffle();
    this.#setupListeners();
  }

  #setupListeners() {
    window.BlogApp.swup?.hooks.on("content:replace", () => {
      this.#shuffle();
    });
  }

  #shuffle() {
    const random = this.#pickRandom();
    if (random) {
      this.#setCurrent(random);
    }
  }

  #pickRandom() {
    if (this.options.length) {
      return this.options[Math.floor(Math.random() * this.options.length)].textContent;
    }

    return null;
  }

  #setCurrent(text) {
    if (this.el) {
      this.el.textContent = text;
    }
  }
}

customElements.define("random-kicker", RandomKicker);
