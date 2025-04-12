/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,svx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.amber.700'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.amber.900'),
              },
              '&:active': {
                color: theme('colors.amber.600'),
              },
            },
            h1: {
              marginTop: '1rem',
              marginBottom: '1rem',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
            },
            h2: {
              marginTop: '1.5rem',
              marginBottom: '1rem',
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
            },
            h3: {
              marginTop: '1.5rem',
              marginBottom: '1rem',
              fontSize: '1.5rem',
              lineHeight: '2rem',
            },
            h4: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
            },
            h5: {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
            },
            'h1 a, h2 a, h3 a, h4 a, h5 a': {
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            code: {
              backgroundColor: theme('colors.amber.200'),
              color: theme('colors.amber.800'),
              padding: '0.25rem',
              borderRadius: '0.25rem',
              display: 'inline-block',
              wordBreak: 'break-all',
            },
            hr: {
              marginTop: '2.5rem',
              marginBottom: '2.5rem',
              borderWidth: '2px',
              borderColor: theme('colors.amber.200'),
            },
            ul: {
              listStyleType: 'disc',
            },
            li: {
              marginLeft: '2rem',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
