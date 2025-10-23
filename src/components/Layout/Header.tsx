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
const Header: React.FC<HeaderProps> = ({ user, onLogoClick, onProfileClick }) => {
  return (
    <header className="sticky top-0 z-50 tg-theme-bg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Лого + Название */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logo} alt="Hi Food Logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold tg-theme-text">Hi Food</h1>
              <p className="text-xs tg-theme-hint">Food Delivery</p>
            </div>
          </button>

          {/* Информация о пользователе */}
          {user && (
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="text-right">
                {/* Имя (кликабельное) */}
                <p className="text-sm font-medium tg-theme-text">
                  {user.first_name}
                </p>

                {/* Бонусы */}
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-xs">💰</span>
                  <span className="text-xs font-semibold text-primary-600">
                    {user.bonus_balance}
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* Для неавторизованных пользователей */}
          {!user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
