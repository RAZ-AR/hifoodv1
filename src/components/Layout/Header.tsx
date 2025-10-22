import React from 'react';
import { User } from '@/types';

interface HeaderProps {
  user: User | null;
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
const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-50 tg-theme-bg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Лого + Название */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">🍕</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tg-theme-text">Hi Food</h1>
              <p className="text-xs tg-theme-hint">Food Delivery</p>
            </div>
          </div>

          {/* Информация о пользователе */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                {/* Приветствие */}
                <p className="text-sm font-medium tg-theme-text">
                  {user.first_name}
                  {user.telegram_username && (
                    <span className="tg-theme-hint text-xs ml-1">
                      @{user.telegram_username}
                    </span>
                  )}
                </p>

                {/* КАРТА ЛОЯЛЬНОСТИ */}
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-xs tg-theme-hint">Card:</span>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full">
                    <span className="text-white text-xs font-bold">
                      #{user.loyalty_card_number}
                    </span>
                    <span className="text-xs">🎴</span>
                  </div>
                </div>

                {/* Бонусы */}
                {user.bonus_balance > 0 && (
                  <p className="text-xs tg-theme-hint mt-0.5">
                    {user.bonus_balance} бонусов
                  </p>
                )}
              </div>

              {/* Аватар */}
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {user.telegram_username ? (
                  <span className="text-lg font-bold">
                    {user.first_name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
            </div>
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
