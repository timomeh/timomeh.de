window.BlogApp ||= {};
BlogApp.Theme ||= {};

BlogApp.Theme.toggle = () => {
  const order = isDarkSystemTheme() ? ["system", "light", "dark"] : ["system", "dark", "light"];

  const newPreference = order[(order.indexOf(themeRoot.dataset.theme) + 1) % order.length];
  storePreference(newPreference);
  applyTheme(newPreference);
};

BlogApp.Theme.getCurrent = () => {
  return document.documentElement.dataset.colorScheme;
};

const themeRoot = document.documentElement;
const systemThemeQuery = matchMedia("(prefers-color-scheme: dark)");

function applyTheme(preference) {
  const previousTheme = themeRoot.dataset.colorScheme;

  themeRoot.dataset.theme = preference;
  if (preference === "system") {
    themeRoot.dataset.colorScheme = isDarkSystemTheme() ? "dark" : "light";
  } else {
    themeRoot.dataset.colorScheme = preference;
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor)
    themeColor.content = themeRoot.dataset.colorScheme === "dark" ? "#0D0D0B" : "#E8E7E4";

  if (previousTheme !== themeRoot.dataset.colorScheme) {
    window.dispatchEvent(new Event("theme:change"));
  }
}

function isDarkSystemTheme() {
  return systemThemeQuery.matches;
}

function storePreference(preference) {
  try {
    if (preference === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", preference);
    }
  } catch {}
}

systemThemeQuery.addEventListener("change", () => {
  if (themeRoot.dataset.theme === "system") {
    applyTheme("system");
  }
});

window.addEventListener("storage", (event) => {
  if (event.key !== "theme") return;

  const sanitizedPreference = ["light", "dark"].includes(event.newValue)
    ? event.newValue
    : "system";
  applyTheme(sanitizedPreference);
});

applyTheme(themeRoot.dataset.theme);
