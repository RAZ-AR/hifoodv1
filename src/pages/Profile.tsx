import React from 'react';
import { User } from '@/types';

interface ProfileProps {
  user: User | null;
}

/**
 * СТРАНИЦА ПРОФИЛЯ - СТИЛЬ РЕФЕРЕНСА
 *
 * Отображает:
 * - Информацию о пользователе
 * - Карту лояльности
 * - Статистику заказов
 */
const Profile: React.FC<ProfileProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="min-h-screen bg-cream-300 flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-6xl mb-4 block">👤</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Authorized</h2>
          <p className="text-gray-600">Open the app from Telegram</p>
        </div>
      </div>
    );
  }

  const getUserInitials = () => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  };

  return (
    <div className="pb-20 bg-cream-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* Информация о пользователе */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {getUserInitials()}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h2>
              {user.telegram_username && (
                <p className="text-sm text-gray-600">@{user.telegram_username}</p>
              )}
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4">
            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📱</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            {user.email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📧</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.registered_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Карта лояльности */}
        {user.loyalty_card_number && (
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 mb-4 text-white">
            <h3 className="text-lg font-bold mb-4">Loyalty Card</h3>
            <div className="text-3xl font-mono font-bold tracking-wider mb-4">
              {user.loyalty_card_number}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">Bonus Balance</span>
              <span className="font-bold text-xl">{user.bonus_balance} pts</span>
            </div>
          </div>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {user.total_orders || 0}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${((user.total_spent || 0) / 100).toFixed(0)} RSD
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>

        {/* Настройки */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <span className="text-sm font-medium text-gray-900">Notifications</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${user.notifications_enabled ? 'bg-primary-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${user.notifications_enabled ? 'ml-6' : 'ml-0.5'}`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌍</span>
                <span className="text-sm font-medium text-gray-900">Language</span>
              </div>
              <span className="text-sm text-gray-600">{user.preferred_language || 'en'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
