import { swup } from "site/swup";

class RandomKicker extends HTMLElement {
  #disconnectedController = new AbortController();

  connectedCallback() {
    this.el = document.querySelector("[data-blog-kicker]");
    this.options = [...document.querySelectorAll("[data-blog-kicker-option]")];
    this.#shuffle();
    this.#setupListeners();
  }

  disconnectedCallback() {
    this.#disconnectedController.abort();
  }

  #setupListeners() {
    const { signal } = this.#disconnectedController;

    const handleReplace = () => this.#shuffle();

    swup?.hooks.on("content:replace", handleReplace);
    signal.addEventListener(
      "abort",
      () => {
        swup?.hooks.off("content:replace", handleReplace);
      },
      { once: true },
    );
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
