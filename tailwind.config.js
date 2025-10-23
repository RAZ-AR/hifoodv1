/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f6f5',
          100: '#d1edeb',
          200: '#a3dbd7',
          300: '#75c9c3',
          400: '#47b7af',
          500: '#5EAEA4',  // Бирюзовый (HyperMart)
          600: '#4b8b83',
          700: '#386862',
          800: '#264542',
          900: '#132321',
        },
        accent: {
          orange: '#F5A962',  // Оранжевый для корзины
          coral: '#E86C6C',   // Коралловый для скидок
          red: '#EF4444',     // Красный для удаления
        },
        telegram: {
          bg: 'var(--tg-theme-bg-color)',
          text: 'var(--tg-theme-text-color)',
          hint: 'var(--tg-theme-hint-color)',
          link: 'var(--tg-theme-link-color)',
          button: 'var(--tg-theme-button-color)',
          buttonText: 'var(--tg-theme-button-text-color)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
