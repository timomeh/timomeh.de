/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: ({ theme: _ }) => ({
        DEFAULT: {
          css: {
            blockquote: {
              'font-style': 'normal',
              'p:first-of-type::before': {
                content: 'none',
              },
              'p:last-of-type::after': {
                content: 'none',
              },
            },
            hr: {
              maxWidth: '120px',
              width: '100%',
              borderWidth: 2,
              margin: '40px auto',
              borderColor: 'rgba(145, 145, 145, 0.3)',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
