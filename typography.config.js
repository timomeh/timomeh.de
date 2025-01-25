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
            '--tw-prose-bullets': '#d1bdae',
            '--tw-prose-invert-body': '#ccc2cc',
            '--tw-prose-invert-headings': '#f2f0f3',
            '--tw-prose-invert-lead': 'rgba(204, 194, 204, 0.7)',
            '--tw-prose-invert-links': '#f2f0f3',
            '--tw-prose-invert-bold': '#f2f0f3',
            '--tw-prose-invert-italics': '#f2f0f3',
            // '--tw-prose-invert-counters': theme('colors.pink[400]'),
            '--tw-prose-invert-bullets': '#988698',
            // '--tw-prose-invert-hr': theme('colors.pink[700]'),
            '--tw-prose-invert-quotes': '#e7e3d0',
            '--tw-prose-invert-quote-borders': 'transparent',
            // '--tw-prose-invert-captions': theme('colors.pink[400]'),
            // '--tw-prose-invert-code': theme('colors.white'),
            // '--tw-prose-invert-pre-code': theme('colors.pink[300]'),
            // '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            // '--tw-prose-invert-th-borders': theme('colors.pink[600]'),
            // '--tw-prose-invert-td-borders': theme('colors.pink[700]'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
