import React from 'react';
import { User } from '@/types';

interface ProfileProps {
  user: User | null;
}

/**
 * СТРАНИЦА ПРОФИЛЯ
 *
 * Отображает:
 * - Информацию о пользователе
 * - Карту лояльности
 * - Статистику заказов и бонусов
 * - Настройки (язык, уведомления)
 */
const Profile: React.FC<ProfileProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-6xl mb-4 block">👤</span>
          <h2 className="text-2xl font-bold tg-theme-text mb-2">Не авторизован</h2>
          <p className="tg-theme-hint">Откройте приложение из Telegram</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tg-theme-text">Профиль</h1>
        </div>

        {/* Информация о пользователе */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
              <span className="text-3xl font-bold">
                {user.first_name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold tg-theme-text">
                {user.first_name} {user.last_name}
              </h2>
              {user.telegram_username && (
                <p className="text-sm tg-theme-hint">@{user.telegram_username}</p>
              )}
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-3">
            {user.phone && (
              <div className="flex items-center gap-3">
                <span className="text-xl">📱</span>
                <div>
                  <p className="text-xs tg-theme-hint">Телефон</p>
                  <p className="text-sm font-medium tg-theme-text">{user.phone}</p>
                </div>
              </div>
            )}

            {user.email && (
              <div className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="text-xs tg-theme-hint">Email</p>
                  <p className="text-sm font-medium tg-theme-text">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="text-xs tg-theme-hint">Регистрация</p>
                <p className="text-sm font-medium tg-theme-text">
                  {new Date(user.registered_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Карта лояльности */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-lg font-bold tg-theme-text mb-4">Карта лояльности</h3>

          <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white mb-4">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm opacity-90">Hi Food Card</p>
                  <p className="text-2xl font-bold mt-1">
                    #{user.loyalty_card_number}
                  </p>
                </div>
                <div className="text-3xl">🎴</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm opacity-90">Владелец</span>
                  <span className="font-medium">{user.first_name} {user.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-90">Бонусов</span>
                  <span className="font-bold text-lg">{user.bonus_balance}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-xs opacity-75">
                  Выдана: {new Date(user.loyalty_card_issued_date).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-lg font-bold tg-theme-text mb-4">Статистика</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl mb-1">💰</p>
              <p className="text-2xl font-bold text-primary-600">{user.bonus_balance}</p>
              <p className="text-xs tg-theme-hint">Бонусов</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl mb-1">🎁</p>
              <p className="text-2xl font-bold text-primary-600">{user.total_bonus_earned}</p>
              <p className="text-xs tg-theme-hint">Заработано</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl mb-1">📦</p>
              <p className="text-2xl font-bold text-primary-600">{user.total_orders}</p>
              <p className="text-xs tg-theme-hint">Заказов</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl mb-1">💵</p>
              <p className="text-2xl font-bold text-primary-600">{user.total_spent.toLocaleString()}</p>
              <p className="text-xs tg-theme-hint">Потрачено ₽</p>
            </div>
          </div>
        </div>

        {/* Настройки */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-lg font-bold tg-theme-text mb-4">Настройки</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <p className="text-sm font-medium tg-theme-text">Язык</p>
                  <p className="text-xs tg-theme-hint">
                    {user.preferred_language === 'ru' ? 'Русский' :
                     user.preferred_language === 'en' ? 'English' :
                     'Srpski (Latinica)'}
                  </p>
                </div>
              </div>
              <button className="text-primary-500 text-sm font-medium">
                Изменить
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="text-sm font-medium tg-theme-text">Уведомления</p>
                  <p className="text-xs tg-theme-hint">
                    {user.notifications_enabled ? 'Включены' : 'Выключены'}
                  </p>
                </div>
              </div>
              <button className="text-primary-500 text-sm font-medium">
                {user.notifications_enabled ? 'Выключить' : 'Включить'}
              </button>
            </div>
          </div>
        </div>

        {/* О приложении */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold tg-theme-text mb-4">О приложении</h3>

          <div className="space-y-3 text-sm tg-theme-hint">
            <p>Hi Food - доставка вкусной еды</p>
            <p>Версия: 1.0.0</p>
            <p className="text-xs">
              Создано с помощью Claude Code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
