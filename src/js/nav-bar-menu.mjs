class NavBarMenu extends HTMLElement {
  #details = this.querySelector("details");
  #summary = this.querySelector("summary");
  #disconnectedController = new AbortController();

  connectedCallback() {
    this.#setupListeners();
  }

  disconnectedCallback() {
    this.#disconnectedController.abort();
  }

  #setupListeners() {
    const { signal } = this.#disconnectedController;

    // close on outside click
    document.addEventListener(
      "click",
      (event) => {
        if (this.#details?.open && !this.#details.contains(event.target)) {
          this.#details.open = false;
        }
      },
      { signal },
    );

    // close on escape key
    document.addEventListener(
      "keydown",
      (event) => {
        // close open menu on escape key
        if (event.key !== "Escape") return;

        this.#details.open = false;
        this.#summary?.focus();
      },
      { signal },
    );
  }
}

customElements.define("blog-nav-bar-menu", NavBarMenu);
