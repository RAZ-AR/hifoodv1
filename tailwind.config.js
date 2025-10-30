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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Зеленый основной
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfcf9',
          200: '#faf8f3',
          300: '#f5f2ea',  // Основной кремовый фон
          400: '#ede8dc',
          500: '#e5ded1',
        },
        accent: {
          green: '#b8e5c0',    // Светло-зеленый для карточек
          blue: '#b3d9f2',     // Светло-голубой для карточек
          yellow: '#fff4d6',   // Желтый для промо
          orange: '#F5A962',   // Оранжевый
          black: '#1a1a1a',    // Черный для кнопок
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
