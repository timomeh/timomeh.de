class ThemeToggle extends HTMLElement {
  #systemThemeQuery = matchMedia("(prefers-color-scheme: dark)");
  #themeRoot = document.documentElement;

  connectedCallback() {
    const toggleButton = this.querySelector("button");

    if (toggleButton) {
      toggleButton.onclick = () => this.toggle();
    }

    this.#setupListeners();
    this.#applyTheme(this.#getTheme());
  }

  toggle() {
    const theme = this.#nextTheme();
    this.#storeTheme(theme);
    this.#applyTheme(theme);
  }

  #setupListeners() {
    this.#systemThemeQuery.addEventListener("change", () => {
      if (this.#getTheme() === "system") {
        this.#applyTheme("system");
      }
    });

    window.addEventListener("storage", (event) => {
      if (event.key !== "theme") return;

      const sanitizedTheme = ["light", "dark"].includes(event.newValue) ? event.newValue : "system";
      this.#applyTheme(sanitizedTheme);
    });
  }

  #nextTheme() {
    const order =
      this.#getSystemTheme() === "dark" ? ["system", "light", "dark"] : ["system", "dark", "light"];
    const next = order[(order.indexOf(this.#themeRoot.dataset.theme) + 1) % order.length];
    return next;
  }

  #storeTheme(theme) {
    try {
      if (theme === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", theme);
      }
    } catch {}
  }

  #applyTheme(theme) {
    const prevColorScheme = this.#getColorScheme();
    let newColorScheme = theme === "system" ? this.#getSystemTheme() : theme;

    this.#setTheme(theme);
    this.#setColorScheme(newColorScheme);
    this.#setMetaTheme(newColorScheme);

    if (prevColorScheme !== newColorScheme) {
      window.dispatchEvent(new Event("theme:change"));
    }
  }

  #getSystemTheme() {
    return this.#systemThemeQuery.matches ? "dark" : "light";
  }

  /* Either "light" or "dark", never "system" */
  #getColorScheme() {
    return this.#themeRoot.dataset.colorScheme;
  }

  #setColorScheme(colorScheme) {
    return (this.#themeRoot.dataset.colorScheme = colorScheme);
  }

  /* "light", "dark" or "system" */
  #getTheme() {
    return this.#themeRoot.dataset.theme;
  }

  #setTheme(theme) {
    return (this.#themeRoot.dataset.theme = theme);
  }

  #setMetaTheme(colorScheme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = colorScheme === "dark" ? "#0D0D0B" : "#E8E7E4";
    }
  }
}

customElements.define("theme-toggle", ThemeToggle);
