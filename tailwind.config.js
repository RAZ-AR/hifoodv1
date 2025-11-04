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
          50: '#e6fffe',
          100: '#ccfffd',
          200: '#99fffb',
          300: '#66fff9',
          400: '#33fff8',
          500: '#01fff7',  // Бирюзовый основной
          600: '#01ccc6',
          700: '#019994',
          800: '#006663',
          900: '#003331',
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
          green: '#b8e5c0',    // Светло-зеленый для карточек (оставляем для совместимости)
          cyan: '#9ff7f2',     // Светло-бирюзовый для карточек
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
      keyframes: {
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
      },
    },
  },
  plugins: [],
}
