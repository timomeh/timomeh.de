class NavBarMenu extends HTMLElement {
  #details = this.querySelector("details");
  #summary = this.querySelector("summary");

  connectedCallback() {
    this.#setupListeners();
  }

  #setupListeners() {
    // close on outside click
    document.addEventListener("click", (event) => {
      if (this.#details?.open && !this.#details.contains(event.target)) {
        this.#details.open = false;
      }
    });

    // close on escape key
    document.addEventListener("keydown", (event) => {
      // close open menu on escape key
      if (event.key !== "Escape") return;

      this.#details.open = false;
      this.#summary?.focus();
    });
  }
}

customElements.define("nav-bar-menu", NavBarMenu);
