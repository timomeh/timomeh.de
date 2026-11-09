window.BlogApp ||= {};

// By using a web component, the theme toggle button click listener can auto-register,
// even when the element is swapped by swup.
// Otherwise the click listener would be gone when swup changes the element.

class ThemeToggle extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector("button");
    if (!button) return;

    button.onclick = () => {
      window.BlogApp.Theme?.toggle();
    };
  }
}

customElements.define("theme-toggle", ThemeToggle);
