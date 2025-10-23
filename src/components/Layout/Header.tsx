import React from 'react';
import { User } from '@/types';
import logo from '@/assets/logo.svg';

interface HeaderProps {
  user: User | null;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
}

/**
 * HEADER С КАРТОЙ ЛОЯЛЬНОСТИ
 *
 * Отображает:
 * - Логотип приложения
 * - Приветствие пользователя
 * - Номер карты лояльности (#1234)
 * - Аватар пользователя
 */
const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const handleNotificationClick = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      window.Telegram.WebApp.showAlert('Уведомления в разработке');
    }
  };

  return (
    <header className="sticky top-0 z-50 tg-theme-bg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Верхняя строка: Лого + Язык + Уведомления */}
        <div className="flex items-center justify-between mb-3">
          {/* Лого */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={logo} alt="Hi Food" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-base font-bold text-primary-500">HiFood</span>
          </button>

          {/* Правая часть: Язык + Уведомления */}
          <div className="flex items-center gap-3">
            {/* Выбор языка */}
            <button className="text-xs font-medium tg-theme-text hover:opacity-70 transition-opacity flex items-center gap-1">
              Eng
              <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>

            {/* Уведомления */}
            <button
              onClick={handleNotificationClick}
              className="relative hover:scale-110 transition-transform"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="fill-accent-coral">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
              {/* Индикатор новых уведомлений */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-accent-coral rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Нижняя строка: Адрес доставки */}
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="text-left flex-1">
            <p className="text-xs text-gray-500">Bengaluru</p>
            <p className="text-sm font-medium tg-theme-text line-clamp-1">
              BTM Layout, 500628
            </p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" className="fill-gray-400">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
