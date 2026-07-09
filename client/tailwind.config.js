/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Didot', 'Bodoni 72', 'Georgia', 'serif'],
      },
      colors: {
        allavanchy: {
          ink: '#0d0d0d',
          black: '#050505',
          ivory: '#f7f4ef',
          pearl: '#fbfaf7',
          stone: '#d8d2c8',
          mist: '#ebe6dd',
          graphite: '#2d2d2d',
          ash: '#756f67',
          oxblood: '#4b1118',
          champagne: '#c3a46f',
        },
      },
      borderRadius: {
        luxury: '0.125rem',
      },
      boxShadow: {
        luxury: '0 24px 60px rgba(13, 13, 13, 0.08)',
        'luxury-soft': '0 14px 34px rgba(13, 13, 13, 0.06)',
      },
      letterSpacing: {
        luxury: '0.18em',
        editorial: '0.28em',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-reveal': {
          '0%': { opacity: '0', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'soft-reveal': 'soft-reveal 900ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
