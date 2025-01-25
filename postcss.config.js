/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-url': {
      url: 'inline',
    },
  },
}
