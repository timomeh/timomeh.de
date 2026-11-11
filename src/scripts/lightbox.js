const visibleImages = [
  ':root[data-color-scheme="light"] [data-fancybox]:not([data-image-theme="dark"]):not([data-image-theme="dark"] *)',
  ':root[data-color-scheme="dark"] [data-fancybox]:not([data-image-theme="light"]):not([data-image-theme="light"] *)',
].join(", ");

if (window.Fancybox) {
  window.Fancybox.bind(document.body, visibleImages, {
    closeButton: true,
    Carousel: {
      infinite: false,
      Toolbar: { display: { right: [] } },
    },
  });

  document.addEventListener("keydown", (event) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target.matches?.("img[data-fancybox]")
    ) {
      event.preventDefault();
      event.target.click();
    }
  });
}
