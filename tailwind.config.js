const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(html[data-theme=light] *, [data-theme=light]) }',
      '&:is([data-theme=dark] *, html[data-theme=dark])',
    ],
  ],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/keystatic.config.tsx'],
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    fontSize: {
      '3xs': ['0.5625rem', { lineHeight: '1' }],
      '2xs': ['0.6875rem', { lineHeight: '1' }],
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '2rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2.5rem' }],
      '3xl': ['2rem', { lineHeight: '2.5rem' }],
      '4xl': ['2.5rem', { lineHeight: '3rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    extend: {
      colors: {
        beige: '#d1bdae',
        gray: colors.stone,
      },
      width: {
        content: 642,
      },
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
      backgroundImage: {
        grainy: "url('./grainy.svg')",
        'grainy-light': "url('./grainy-light.svg')",
        'crt-lines': "url('./crt-lines.svg')",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-outfit)'],
        mono: ['var(--font-ibm-plex-mono)'],
        pixel: ['var(--font-pixeloid)'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s linear',
      },
      keyframes: {
        flap: {
          '0%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(0.85)' },
          '100%': { transform: 'scaleX(1)' },
        },
        archiveTip: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(2px)' },
          '100%': { transform: 'translateY(0) rotate(8deg)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        outlineBounce: {
          '0%': {
            outlineOffset: '4px',
          },
          '50%': {
            outlineOffset: '6px',
          },
          '100%': {
            outlineOffset: '4px',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
