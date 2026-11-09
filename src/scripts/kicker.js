window.BlogApp ||= {};
BlogApp.Kicker ||= {};

BlogApp.Kicker.randomize = () => {
  const el = document.querySelector("[data-blog-kicker]");
  const options = [...document.querySelectorAll("[data-blog-kicker-option]")];
  if (el && options.length) {
    el.textContent = randomItem(options).textContent;
  }
};

function randomItem(options) {
  return options[Math.floor(Math.random() * options.length)];
}

BlogApp.Kicker.randomize();
